import ShareUtil from '../util/shareUtil.js';

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
            return await fetch('https://spectra.daouoffice.com/api/user/session')
                .then(response => response.json())
                .then(response => {
                    return true;
                });
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async findUserInfo() {
        const _this = this;
        let data = {}

        return Promise.all([
            fetch('https://spectra.daouoffice.com/api/ehr/timeline/info', _this.requestOptions())
                .then(value => value.json()),
            fetch('https://spectra.daouoffice.com/api/ehr/timeline/summary')
                .then(value => value.json())
        ])
            .then((response) => {
                const infoResponse = response[0];
                const infoData = infoResponse.data;
                data = {
                    ...data,
                    clockInTime: infoData.workInTime,
                    clockOutTime: infoData.workOutTime
                };

                const summaryResponse = response[1];

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
            })
            .catch((err) => {
                console.log(err);
                return null;
            });
    }

    async findList() {
        const _this = this;
        const count = 10;


        return fetch(`https://spectra.daouoffice.com/api/board/2302/posts?offset=${count}&page=0`)
            .then(response => response.json());
    }

    async findCalendar() {
        const _this = this;
        return await fetch(`https://spectra.daouoffice.com/api/calendar/user/me/event/daily?year=${_this.getCurrYear()}&month=${_this.getCurrMonth()}`)
            .then(response => response.json())
            .then(response => {
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
            });

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
        return await fetch(`https://spectra.daouoffice.com/api/home/noti/new`)
            .then(response => response.json())
            .then(response => {
                return response.data
            });
    }

    async findDayoffList() {
        const _this = this;

        const currDate = ShareUtil.getCurrDate();
        const toDate = ShareUtil.addDays(currDate, 7);

        return await fetch(`https://spectra.daouoffice.com/api/calendar/event?timeMin=${currDate}T00%3A00%3A00.000%2B09%3A00&timeMax=${toDate}T23%3A59%3A59.999%2B09%3A00&includingAttendees=true&calendarIds%5B%5D=8452&calendarIds%5B%5D=8987&calendarIds%5B%5D=11324&calendarIds%5B%5D=11326`)
            .then(response => response.json())
            .then(response => response.data);
    }

    async findMyDayoffList() {
        const currDate = ShareUtil.getCurrDate();

        return await fetch(`https://spectra.daouoffice.com/api/ehr/vacation/stat?baseDate=${currDate}`)
            .then(response => response.json())
            .then(response => response.data);

    }

    async clockIn(params) {
        const _this = this;
        const data = {"checkTime":`${ShareUtil.getCurrDate()}T${ShareUtil.getCurrTime()}.000Z`,"timelineStatus":{},"isNightWork":false,"workingDay":`${ShareUtil.getCurrDate()}`};

        const options = {
            method: 'POST',
            headers: _this.requestOptions().headers,
            body: JSON.stringify(data),
        };

        return await fetch(`https://spectra.daouoffice.com/api/ehr/timeline/status/clockIn?userId=${params.userId}&baseDate=${ShareUtil.getCurrDate()}`, options)
            .then(response => response.json())
            .then(response => response);

        /*return await fetch(`https://spectra.daouoffice.com/api/ehr/timeline/status/clockIn?userId=${params.userId}&baseDate=${ShareUtil.getCurrDate()}`, data, _this.requestOptions())
            .then(response => response.json())
            .then(response => response.data)
            .catch(e => {
                return e.response.data;
            });*/
    }

    async clockOut() {
        const _this = this;
        const data = {"checkTime":`${ShareUtil.getCurrDate()}T${ShareUtil.getCurrTime()}.000Z`,"timelineStatus":{},"isNightWork":false,"workingDay":`${ShareUtil.getCurrDate()}`};

        const options = {
            method: 'POST',
            headers: _this.requestOptions().headers,
            body: JSON.stringify(data),
        };

        return await fetch(`https://spectra.daouoffice.com/api/ehr/timeline/status/clockOut?userId=${params.userId}&baseDate=${ShareUtil.getCurrDate()}`, options)
            .then(response => response.json())
            .then(response => response);

        /*
        return await fetch(`https://spectra.daouoffice.com/api/ehr/timeline/status/clockOut?userId=${params.userId}&baseDate=${ShareUtil.getCurrDate()}`, data, _this.requestOptions())
            .then(response => response.json())
            .then(response => response.data)
            .catch(e => {
                return e.response.data;
            });*/

        /*try {
            const response = await axios.post(`https://spectra.daouoffice.com/api/ehr/timeline/status/clockOut?userId=${this.getUserId()}&baseDate=${ShareUtil.getCurrDate()}`, data, _this.requestOptions());
        } catch (error) {
            ShareUtil.printAxiosError(error);
            _this.mainWindowSender.send('clockOutCallback', error.response.data);
        }*/
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
