import axios from 'axios';
axios.defaults.withCredentials = true;
class DaouofficeRespository  {

    getConfig() {
        return {
            headers: {
                TimeZoneOffset: 540,
                Cookie: "GOSSOcookie=edcb06c8-a7de-4643-8c13-a5d8af1323ed"
            }
        }
    }

    findUserInfo() {
        /*return axios.get('https://spectra.daouoffice.com/api/ehr/timeline/info')
            .then(({data}) => data);*/

        return axios.get("https://cors-anywhere.herokuapp.com/https://spectra.daouoffice.com/api/ehr/timeline/info", this.getConfig())
            .then(response => {
                return response;
            });

    }
}

export default new DaouofficeRespository();
