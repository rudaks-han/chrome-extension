
export default class JenkinsClient {
    constructor() {}

    requestOptions() {
        return {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    async checkLogin() {
        try {
            return await fetch('http://211.63.24.41:8080')
                .then(response => {
                    return response.status === 200;
                });
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    getApiUrl(moduleName, branch) {
        return `http://211.63.24.41:8080/view/victory/job/${moduleName}/job/${branch}/lastBuild/api/json?moduleName=${moduleName}`;
    }

    getModuleUrl() {
        return `http://211.63.24.41:8080/view/victory/api/json`;
    }

    findUseAlarmOnError() {
        //let data = this.getStore().get(this.useAlarmOnErrorStoreId);
        //if (data == null) data = false;
        //this.mainWindowSender.send('findUseAlarmOnErrorCallback', data);
    }

    async findModuleList() {
        const _this = this;
        return await fetch(_this.getModuleUrl())
            .then(response => response.json())
            .then(response => {
                let moduleUrls = [];
                let filteredJobs = [];

                response.jobs.map(job => {
                    if (job._class === 'org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject') {
                        moduleUrls.push(_this.getModuleDetailUrl(job.name));
                        filteredJobs.push(job);
                    }
                });

                Promise.all(_this.fetchAll(moduleUrls))
                    .then((responses) => {
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
                    })
                    .catch((err) => {
                        console.log(err);
                        //return null;
                    });

                return {
                    filteredJobs,
                    availableModules: _this.getAvailableModules()
                };
            })
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
        return `http://211.63.24.41:8080/job/${moduleName}/api/json`;
    }

    addAvailableModule(event, data) {
        const name = data.name;
        const branch = data.value;
        const availableModules = this.getAvailableModules();
        let exists = false;
        availableModules.map(availableModule => {
            if (name == availableModule.name) {
                exists = true;
            }
        });

        if (!exists) {
            availableModules.push({name, branch});
            this.setAvailableModules(availableModules);
        }
    }

    removeAvailableModule(event, data) {
        const {name, branch} = data;
        const availableModules = this.getAvailableModules();

        const newAvailableModules = availableModules.filter(module => module.name !== name);
        this.setAvailableModules(newAvailableModules);
    }

    useAlarmOnError(event, data) {
        //this.getStore().set(this.useAlarmOnErrorStoreId, data);
    }

    getAvailableModules() {
        //return this.getStore().get(this.availableModuleStoreId);
        return null;
    }

    setAvailableModules(data) {
        //this.getStore().set(this.availableModuleStoreId, data);
    }

    async findList() {
        let availableModules = this.getAvailableModules();
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
        await Promise.all(_this.fetchAll(urls))
            .then((responses) => {
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
            })
            .catch((err) => {
                console.log(err);
                //return null;
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
