
export default class LoginClient {
    constructor() {
    }

    axiosConfig() {
        return {
            headers: {
                TimeZoneOffset: 540
            },
        };
    }

    findUserInfo() {
        const _this = this;

        return fetch('https://spectra.daouoffice.com/api/user/today', _this.axiosConfig())
            .then(response => response.json())
            .then(response => {
                console.error('___response')
                console.error(response)
                const data = response.data;
                const {id, employeeNumber, name, position, deptMembers} = data.profile; // id: 7667, employeeNumber: 2014001
                const deptName = deptMembers[0].deptName;
                const userInfo = {id, employeeNumber, name, position, deptName};
                //this.getStore().set('userInfo', userInfo);

                console.log(userInfo);

                return userInfo;

            });

        /*return axios.get('https://spectra.daouoffice.com/api/user/today')
            .then(response => {
                const data = response.data.data;
                const {id, employeeNumber, name, position, deptMembers} = data.profile; // id: 7667, employeeNumber: 2014001
                const deptName = deptMembers[0].deptName;
                const userInfo = {id, employeeNumber, name, position, deptName};
                //this.getStore().set('userInfo', userInfo);

                //console.log(userInfo);

                return userInfo;
            });*/
    }
}

