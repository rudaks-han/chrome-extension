import ShareUtil from '../../util/shareUtil.js';
import HttpRequest from "../../util/httpRequest.js";

export default class DaouofficeClient {
    constructor() {
    }

    requestOptions() {
        return {
            headers: {
                'Content-Type': 'application/json',
                TimeZoneOffset: 540
            }
        };
    }

    async checkLogin() {
        try {
            const response = await HttpRequest.request('https://spectra.daouoffice.com/api/user/session');
            return response.code == '200';
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async findUserInfo() {
        const _this = this;
        let data = {}

        const responses = await HttpRequest.requestAll([
            'https://spectra.daouoffice.com/api/ehr/timeline/info',
            'https://spectra.daouoffice.com/api/ehr/timeline/summary'
        ], _this.requestOptions());

        const infoResponse = responses[0];
        const infoData = infoResponse.data;
        data = {
            ...data,
            clockInTime: infoData.workInTime,
            clockOutTime: infoData.workOutTime
        };

        const summaryResponse = responses[1];

        const workTimeRange = summaryResponse.group.fixedOption.workTimeRange;
        const workStartTime = workTimeRange.workStartTime;
        const workEndTime = workTimeRange.workEndTime;
        const userId = summaryResponse.month.user.id;
        const username = summaryResponse.month.user.name;

        return {
            ...data,
            workStartTime,
            workEndTime,
            userId,
            username
        };
    }

    async findList() {
        const count = 10;

        return await HttpRequest.request(`https://spectra.daouoffice.com/api/board/2302/posts?offset=${count}&page=0`);
    }

    async findCalendar() {
        const _this = this;
        const response = await HttpRequest.request(`https://spectra.daouoffice.com/api/calendar/user/me/event/daily?year=${_this.getCurrYear()}&month=${_this.getCurrMonth()}`);
        let holidayList = {};
        let dayOffList = {};
        let list = response.data.list;

        list.map(item => {
            let datetime = item.datetime;
            let eventList = item.eventList;

            let date = datetime.substring(0, 10);

            if (eventList.length > 0) {
                eventList.map(event => {
                    let type = event.type; // holiday: 휴일, company: 연차/공가)
                    let summary = event.summary; // 연차 : 서형태, 반차: 이승엽(오후), 공가 : 유민(오후)

                    if (type === 'holiday' || type === 'anniversary') { // anniversary : 근로자의 날
                        holidayList[date] = type;
                    } else if (type === 'company') {
                        if (!dayOffList[date])
                            dayOffList[date] = [];
                        if (_this.hasDayoffString(summary)) {
                            dayOffList[date].push(summary); // summary => 연차 : 한경만
                        }
                    } else if (type === 'normal') {
                        if (summary === '연차') {
                            dayOffList[date].push(summary + ':' + event.creator.name);
                        }
                    }
                });
            }
        });

        return {
            holidayList,
            dayOffList
        };
    }

    getCurrYear() {
        const currDate = new Date();
        return currDate.getFullYear();
    }

    getCurrMonth() {
        const currDate = new Date();
        let month = currDate.getMonth() + 1;
        if (month < 10)
            month = '0' + month;

        return month;
    }

    hasDayoffString(summary) {
        const dayoffString = ['연차', '반차', '장기근속', '보상'];

        for (let i=0; i<dayoffString.length; i++) {
            if (summary.indexOf(dayoffString[i]) > -1) {
                return true;
            }
        }

        return false;
    }

    async findNotificationCount() {
        const response = await HttpRequest.request('https://spectra.daouoffice.com/api/home/noti/new');
        return response.data;
    }

    async findDayoffList() {
        const currDate = ShareUtil.getCurrDate();
        const toDate = ShareUtil.addDays(currDate, 7);

        const response = await HttpRequest.request(`https://spectra.daouoffice.com/api/calendar/event?timeMin=${currDate}T00%3A00%3A00.000%2B09%3A00&timeMax=${toDate}T23%3A59%3A59.999%2B09%3A00&includingAttendees=true&calendarIds%5B%5D=8452&calendarIds%5B%5D=8987&calendarIds%5B%5D=11324&calendarIds%5B%5D=11326`);
        return response.data;
    }

    async findMyDayoffList() {
        const currDate = ShareUtil.getCurrDate();

        const response = await HttpRequest.request(`https://spectra.daouoffice.com/api/ehr/vacation/stat?baseDate=${currDate}`);
        return response.data;
    }

    async clockIn(params) {
        const _this = this;
        const data = {"checkTime":`${ShareUtil.getCurrDate()}T${ShareUtil.getCurrTime()}.000Z`,"timelineStatus":{},"isNightWork":false,"workingDay":`${ShareUtil.getCurrDate()}`};

        const options = {
            method: 'POST',
            headers: _this.requestOptions().headers,
            body: JSON.stringify(data),
        };

        return await HttpRequest.request(`https://spectra.daouoffice.com/api/ehr/timeline/status/clockIn?userId=${params.userId}&baseDate=${ShareUtil.getCurrDate()}`, options);
    }

    async clockOut() {
        const _this = this;
        const data = {"checkTime":`${ShareUtil.getCurrDate()}T${ShareUtil.getCurrTime()}.000Z`,"timelineStatus":{},"isNightWork":false,"workingDay":`${ShareUtil.getCurrDate()}`};

        const options = {
            method: 'POST',
            headers: _this.requestOptions().headers,
            body: JSON.stringify(data),
        };

        return await HttpRequest.request(`https://spectra.daouoffice.com/api/ehr/timeline/status/clockOut?userId=${params.userId}&baseDate=${ShareUtil.getCurrDate()}`, options);
    }
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

    if (changeInfo.status != 'complete')
        return;

    if (tab.url.startsWith('https://spectra.daouoffice.com/app/home')) {
        chrome.runtime.sendMessage({action: 'daouofficeClient.loginOk'});
    }
});

function sendMessage(request) {
    chrome.runtime.sendMessage(request);
}
