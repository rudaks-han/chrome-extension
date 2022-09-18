import HttpRequest from "../../util/httpRequest.js";
import StorageUtil from "../../util/storageUtil.js";

export default class SonarqubeClient {
    constructor() {
        this.API_URL = 'http://211.63.24.41:9000';
    }

    requestOptions() {
        return {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    getApiUrl(key) {
        return `${this.API_URL}/api/measures/component?component=${key}&metricKeys=new_bugs,new_vulnerabilities,new_security_hotspots,new_code_smells,projects`;
    }

    findUseAlarmOnError() {
        /*let data = this.getStore().get(this.useAlarmOnErrorStoreId);
        if (data == null) data = false;
        this.mainWindowSender.send('findUseAlarmOnErrorCallback', data);*/
    }

    async findModuleList() {
        const _this = this;

        const response = await HttpRequest.request(`${this.API_URL}/api/components/search?qualifiers=TRK`);
        const availableModules = await _this.getAvailableModules();
        return {
            data: response,
            availableModules
        }
    }

    async addAvailableModule(data) {
        const {name, key} = data;
        const availableModules = await this.getAvailableModules();

        let exists = false;
        availableModules.map(availableModule => {
            if (name == availableModule.name) {
                exists = true;
            }
        });

        if (!exists) {
            availableModules.push({name, key});
            await this.setAvailableModules(availableModules);
        }
    }

    async removeAvailableModule(data) {
        const {name, key} = data;
        const availableModules = await this.getAvailableModules();

        const newAvailableModules = availableModules.filter(module => module.name !== name);
        await this.setAvailableModules(newAvailableModules);
    }

    async getAvailableModules() {
        /*const modules = this.getStore().get(this.availableModuleStoreId);
        return  modules == null ? [] : modules;*/
        //return [];
        return await StorageUtil.getStorageData('sonarqube_availableModules') || [];
    }

    async setAvailableModules(data) {
        //this.getStore().set(this.availableModuleStoreId, data);
        await StorageUtil.setStorageData({
            'sonarqube_availableModules': data
        });
    }

    useAlarmOnError(data) {
        //this.getStore().set(this.useAlarmOnErrorStoreId, data);
    }

    async findList() {
        let availableModules = await this.getAvailableModules();
        if (!availableModules || availableModules.length === 0) {
            availableModules = [{
                name: 'talk-api-mocha',
                key: 'talk-api-mocha'
            }];
            await this.setAvailableModules(availableModules);
        }

        const _this = this;

        let urls = [];
        availableModules.map(module => {
            urls.push(this.getApiUrl(module.key))
        });

        let buildResults = [];
        const responses = await HttpRequest.requestAll(urls, {});
        responses.map(response => {
            if (response.component) {
                const moduleName = response.component.name;
                const measures = response.component.measures;
                buildResults.push({ moduleName, measures, hasError: false })
            } else {
                const url = response.config.url;
                const moduleName = _this.getParam(url, 'component');
                buildResults.push({moduleName, measures: [], hasError: true})
            }

        });

        return buildResults;
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
