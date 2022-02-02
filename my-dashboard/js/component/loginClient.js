
class LoginClient {
    constructor() {
    }

    axiosConfig(GOSSOcookie) {
        const cookieDataString = `GOSSOcookie=${GOSSOcookie}`
        return {
            /*headers: {
                TimeZoneOffset: 540,
                Cookie: `${cookieDataString};`
            },*/
        };
    }

    findUserInfo() {
        const _this = this;
        //let GOSSOcookie = '';

        console.error('get')
        return axios.get('https://spectra.daouoffice.com/api/user/today')
            .then(response => {
                console.error('response')
                const data = response.data.data;
                const {id, employeeNumber, name, position, deptMembers} = data.profile; // id: 7667, employeeNumber: 2014001
                const deptName = deptMembers[0].deptName;
                const userInfo = {id, employeeNumber, name, position, deptName};
                //this.getStore().set('userInfo', userInfo);

                console.log('loginClient#findUserInfo');
                console.log(userInfo);

                //chrome.runtime.sendMessage({action: 'loginClient.findUserInfoCallback', userInfo});
                return userInfo;
                //_this.mainWindowSender.send('findUserInfoCallback', userInfo);
                //_this.mainWindowSender.send('authenticated', true);
            });

        /*ShareUtil.getCookie('https://spectra.daouoffice.com', 'GOSSOcookie')
            .then(GOSSOcookie => {
                console.error('get')

            })*/


    }
}