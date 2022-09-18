import HttpRequest from "../../util/httpRequest.js";
import StorageUtil from "../../util/storageUtil.js";

export default class JenkinsClient {
    constructor() {
        this.API_URL = 'http://211.63.24.41:8080';
    }

    requestOptions() {
        return {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    async checkLogin() {
        try {
            const response = await HttpRequest.requestText(this.API_URL);
            return response.status === 200;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    getApiUrl(moduleName, branch) {
        return `${this.API_URL}/view/victory/job/${moduleName}/job/${branch}/lastBuild/api/json?moduleName=${moduleName}`;
    }

    findUseAlarmOnError() {
        //let data = this.getStore().get(this.useAlarmOnErrorStoreId);
        //if (data == null) data = false;
        //this.mainWindowSender.send('findUseAlarmOnErrorCallback', data);
    }

    async findModuleList() {
        const _this = this;
        const response = await HttpRequest.request(`${this.API_URL}/view/victory/api/json`);

        let moduleUrls = [];
        let filteredJobs = [];

        response.jobs.map(job => {
            if (job._class === 'org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject') {
                moduleUrls.push(_this.getModuleDetailUrl(job.name));
                filteredJobs.push(job);
            }
        });

        const responses = await HttpRequest.requestAll(moduleUrls, {});
        responses.map(response => {
            const fullName = response.fullName;
            let branch = 'master';
            const selectedJob = _this.filter(response.jobs, 'color', 'blue');
            if (selectedJob != null) {
                branch = selectedJob.name;
            }

            filteredJobs.map(filteredJob => {
                if (filteredJob.name === fullName) {
                    filteredJob['branch'] = branch;
                }
            });
        });

        const availableModules = await _this.getAvailableModules();
        return {
            filteredJobs,
            availableModules
        };
    }

    filter(items, key, value) {
        let selectedItem = null;
        items.map(item => {
            if (item[key] == value) {
                if (selectedItem == null) {
                    selectedItem = item;
                }
            }
        });
        return selectedItem;
    }

    getModuleDetailUrl(moduleName) {
        return `${this.API_URL}/job/${moduleName}/api/json`;
    }

    async setAvailableModules(data) {
        await StorageUtil.setStorageData({
            'jenkins_availableModules': data
        });
    }

    async getAvailableModules() {
        return await StorageUtil.getStorageData('jenkins_availableModules');
    }

    async addAvailableModule(data) {
        const name = data.name;
        const branch = data.value;
        const availableModules = await this.getAvailableModules() || [];
        let exists = false;
        availableModules.map(availableModule => {
            if (name == availableModule.name) {
                exists = true;
            }
        });

        if (!exists) {
            availableModules.push({name, branch});
            await this.setAvailableModules(availableModules);
        }
    }

    async removeAvailableModule(data) {
        const {name, branch} = data;
        const availableModules = await this.getAvailableModules();

        const newAvailableModules = availableModules.filter(module => module.name !== name);
        await this.setAvailableModules(newAvailableModules);
    }

    useAlarmOnError(data) {
        //this.getStore().set(this.useAlarmOnErrorStoreId, data);
    }

    async findList() {
        let availableModules = await this.getAvailableModules();
        if (!availableModules) {
            availableModules = [
                {
                    name: 'talk-api-mocha',
                    branch: 'master'
                }
            ];
            this.setAvailableModules(availableModules);
        }

        const _this = this;

        const urls = await Promise.all(
            availableModules.map(module => {
                return _this.findModuleUrl(module);
            })
        )

        let buildResults = [];
        const responses = await HttpRequest.requestAll(urls, {});
        let sessionExpired = true;
        responses.map(response => {
            if (response.url) {
                const moduleName = _this.extractModuleName(response.fullDisplayName);
                const url = response.url;
                const result = response.result;
                const timestamp = response.timestamp;
                const fullDisplayName = response.fullDisplayName;
                let lastChangeSets = response.changeSets[0];
                let lastCommit = {};
                if (lastChangeSets) {
                    lastCommit['authorName'] = lastChangeSets.items[0].author.fullName;
                    lastCommit['comment'] = lastChangeSets.items[0].comment;
                    lastCommit['date'] = lastChangeSets.items[0].date;
                }

                sessionExpired = false;
                buildResults.push({url, moduleName, result, timestamp, fullDisplayName, lastCommit, hasError: false})
            } else {
                const url = response.config.url;
                const moduleName = _this.getParam(url, 'moduleName');
                buildResults.push({url:'', moduleName, result:'', timestamp:0, fullDisplayName:'', lastCommit: {}, hasError: true})
            }
        });

        return buildResults;
    }

    fetchAll(urls) {
        return urls.map(url => {
            return fetch(url)
                .then(value => value.json());
        });
    }

    async findModuleUrl(module) {
        return this.getApiUrl(module.name, module.branch);
    }

    extractModuleName(fullDisplayName) {
        return fullDisplayName.substring(0, fullDisplayName.indexOf(' '));
    }

    getParam(url, name) {
        let params = url.substr(url.indexOf("?") + 1);
        let sval = "";

        params = params.split("&");

        for (let i = 0; i < params.length; i++) {
            let temp = params[i].split("=");
            if ([temp[0]] == name) { sval = temp[1]; }
        }

        return sval;
    }
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status != 'complete')
        return;

    if (tab.url === `${this.API_URL}/`) {
        chrome.runtime.sendMessage({action: 'jenkinsClient.login'});
    } else if (tab.url.startsWith(`${this.API_URL}/logout`)
        || tab.url.startsWith(`${this.API_URL}/login`)) {
        chrome.runtime.sendMessage({action: 'jenkinsClient.logout'});
    }
});