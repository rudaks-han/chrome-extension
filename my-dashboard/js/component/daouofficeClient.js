
class DaouofficeClient {
    constructor() {
    }

    axiosConfig() {
        const cookieDataString = "GOSSOcookie=bcca1e77-6eef-4e1d-ae04-fbbfa8489505"
        return {
            headers: {
                TimeZoneOffset: 540,
                Cookie: `${cookieDataString};`
            }
        };
    }

    async findUserInfo() {
        const _this = this;
        let data = {}

        const response = await axios.all(
            [
                axios.get('https://spectra.daouoffice.com/api/ehr/timeline/info', _this.axiosConfig()),
                axios.get('https://spectra.daouoffice.com/api/ehr/timeline/summary', _this.axiosConfig())
                ]
        );

        const infoResponse = response[0];
        console.error('infoResponse')
        console.error(infoResponse)
        const infoData = infoResponse.data.data;
        data = {
            ...data,
            clockInTime: infoData.workInTime,
            clockOutTime: infoData.workOutTime
        };

        const summaryResponse = response[1];
        console.error('summaryResponse')
        console.error(summaryResponse)

        //const workTimeRange = summaryResponse.data.group.fixedOption.workTimeRange;
        const workStartTime = '07:00'; //workTimeRange.workStartTime;
        const workEndTime = '16:00'; //workTimeRange.workEndTime;

        /*_this.getStore().set(this.clockInTimeStoreId, workStartTime);
        _this.getStore().set(this.clockOutTimeStoreId, workEndTime);*/

        data = {
            ...data,
            workStartTime,
            workEndTime
        };

        //console.error(data);

        console.error('to daouofficeClient.findUserInfoCallback');
        chrome.runtime.sendMessage({action: 'daouofficeClient.findUserInfoCallback', data});
/*
        try {
            _this.mainWindowSender.send('findUserInfoCallback', data);
        } catch (e) {
            ShareUtil.printAxiosError(e);
        }*/
    }

    async findList() {
        const _this = this;
        const count = 10;

        try {
            return axios.get(`https://spectra.daouoffice.com/api/board/2302/posts?offset=${count}&page=0`)
                .then(response => response.data);
        } catch (e) {
            //_this.mainWindowSender.send('authenticated', false);
            //_this.mainWindowSender.send('findListCallback', []);
            console.error(e);
        }
    }
}