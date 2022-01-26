import axios from 'axios';

class DaouofficeRespository  {

    findUserInfo() {
        return axios.get('https://spectra.daouoffice.com/api/ehr/timeline/info')
            .then(({data}) => data);
    }
}

export default DaouofficeRespository;
