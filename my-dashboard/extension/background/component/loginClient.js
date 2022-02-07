import HttpRequest from "../../util/httpRequest.js";

export default class LoginClient {
    constructor() {
    }

    requestOptions() {
        return {
            headers: {
                TimeZoneOffset: 540
            },
        };
    }

    async findUserInfo() {
        const _this = this;

        const response = await HttpRequest.request('https://spectra.daouoffice.com/api/user/today', _this.requestOptions());
        const data = response.data;
        const {id, employeeNumber, name, position, deptMembers} = data.profile; // id: 7667, employeeNumber: 2014001
        const deptName = deptMembers[0].deptName;
        const userInfo = {id, employeeNumber, name, position, deptName};
        //this.getStore().set('userInfo', userInfo);

        return userInfo;
    }
}

