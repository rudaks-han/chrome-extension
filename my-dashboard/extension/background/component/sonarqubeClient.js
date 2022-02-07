import HttpRequest from "../../util/httpRequest.js";

export default class SonarqubeClient {
    constructor() {}

    requestOptions() {
        return {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    getApiUrl(key) {
        return `http://211.63.24.41:9000/api/measures/component?component=${key}&metricKeys=new_bugs,new_vulnerabilities,new_security_hotspots,new_code_smells,projects`;
    }

    findUseAlarmOnError() {
        /*let data = this.getStore().get(this.useAlarmOnErrorStoreId);
        if (data == null) data = false;
        this.mainWindowSender.send('findUseAlarmOnErrorCallback', data);*/
    }

    async findModuleList() {
        const _this = this;

        const response = await HttpRequest.request('http://211.63.24.41:9000/api/components/search?qualifiers=TRK');
        return {
            data: response,
            availableModules: _this.getAvailableModules()
        }
    }

    addAvailableModule(event, data) {
        const {name, key} = data;
        const availableModules = this.getAvailableModules();

        let exists = false;
        availableModules.map(availableModule => {
            if (name == availableModule.name) {
                exists = true;
            }
        });

        if (!exists) {
            availableModules.push({name, key});
            this.setAvailableModules(availableModules);
        }
    }

    removeAvailableModule(event, data) {
        const {name, key} = data;
        const availableModules = this.getAvailableModules();

        const newAvailableModules = availableModules.filter(module => module.name !== name);
        this.setAvailableModules(newAvailableModules);
    }

    getAvailableModules() {
        /*const modules = this.getStore().get(this.availableModuleStoreId);
        return  modules == null ? [] : modules;*/
        return [];
    }

    setAvailableModules(data) {
        //this.getStore().set(this.availableModuleStoreId, data);
    }

    useAlarmOnError(event, data) {
        //this.getStore().set(this.useAlarmOnErrorStoreId, data);
    }

    async findList() {
        let availableModules = this.getAvailableModules();
        if (!availableModules || availableModules.length === 0) {
            availableModules = [{
                name: 'talk-api-mocha',
                key: 'talk-api-mocha'
            }];
            this.setAvailableModules(availableModules);
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
