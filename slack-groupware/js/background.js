


function checkCalendar() {
    // https://spectra.daouoffice.com/api/calendar/event?timeMin=2021-03-28T00%3A00%3A00.000%2B09%3A00&timeMax=2021-05-01T23%3A59%3A59.999%2B09%3A00&includingAttendees=true&calendarIds%5B%5D=8452&calendarIds%5B%5D=8987&calendarIds%5B%5D=11324&calendarIds%5B%5D=11326
    // https://spectra.daouoffice.com/api/calendar/event?timeMin=2021-02-28T00%3A00%3A00.000%2B09%3A00&timeMax=2021-04-03T23%3A59%3A59.999%2B09%3A00&includingAttendees=true&calendarIds%5B%5D=8452&calendarIds%5B%5D=8987&calendarIds%5B%5D=11324&calendarIds%5B%5D=11326
    // https://spectra.daouoffice.com/api/calendar/event?timeMin=2021-04-25T00%3A00%3A00.000%2B09%3A00&timeMax=2021-06-05T23%3A59%3A59.999%2B09%3A00&includingAttendees=true&calendarIds%5B%5D=8452&calendarIds%5B%5D=8987&calendarIds%5B%5D=11324&calendarIds%5B%5D=11326

    const members = [
        '허동혁', '김용익', '한경만', '조승열', '심재희', '유민', '김성윤', '정은영',
        '김지훈', '이정호', '전소희', '박정균',
        '김선숙', '김호진',
        '박은규',
        //'정재헌', '김지홍'
        '유승화'
    ];

    let currDate = getCurrDate();
    //currDate = '2021-03-29';

    //let currentDate = new Date(currDate + '/00:00:00');
    let currentDate = new Date();
    if (currentDate.getDay() == 0 || currentDate.getDay() == 6) { // 토, 일 제외
        console.log('금일은 휴일(토/일)입니다.')
        return;
    }

    const options = {
        method: 'get',
        url: 'https://spectra.daouoffice.com/api/calendar/event?timeMin=' + currDate + 'T00%3A00%3A00.000%2B09%3A00&timeMax=' + currDate + 'T23%3A59%3A59.999%2B09%3A00&includingAttendees=true&calendarIds%5B%5D=8452&calendarIds%5B%5D=8987&calendarIds%5B%5D=11324&calendarIds%5B%5D=11326',

        success : (res) => {

            let message = '';

            res.data.map(item => {

 //               console.log(item);

                if (item.type == 'holiday') {
                    const endTime = item.endTime;

                    if (endTime.startsWith(currDate)) {
                        console.log('금일은 휴일(holiday)입니다.');
                        return;
                    }
                }

                if (item.type == 'company') {
                    const calendarName = item.calendarName; // 종일휴가_연차,위로,공가
                    const summary = item.summary; // "연차(4/5~7):김선숙,김지홍"

                    const arSummary = summary.split(':');
                    const type = arSummary[0]; // 연차(4/5~7)
                    const users = arSummary[1]; // 김선숙,김지홍
                    const arUsers = users.split(',');

                    if (arUsers.length) {
                        for (let i=0; i<arUsers.length; i++) {
                            const user = arUsers[i].trim();
                            if (members.includes(user)) {
                                console.error('>>> ' + type + ': ' + user);
                                message += type + ': ' + user + '\n';
                            }
                        }
                    }
                }
            });

            if (message.length > 0) {
                message = `[${currDate}] 금일 연차 현황\n${message}`;
                sendToSlack(message);
            }
        },
        error : (xhr, e) => {
            console.error('error');
            console.error(e);
        },
    };

    requestAjax(options);
}


function sendToSlack(message) {

    //https://slack.com/api/chat.postMessage?token=xoxb-471569414946-1939462143793-3KH8oAWqiKNvFuzWi7UxB56P&channel=C01T21V0GG6&text=1

    // C01FRS7V830 31-개발팀-backend
    // C01FJRQF8KX 30-victory-개발팀
    const channel = 'C01T21V0GG6'; // test-channel
    const authToken = '';

    const headers = {
        "Authorization": "Bearer " + authToken,
        "Content-Type" : "application/json"
    }

    const body = {
        channel: channel, // Slack user or channel, where you want to send the message
        text: message
    }

    const options = {
        method: 'post',
        url: 'https://slack.com/api/chat.postMessage',
        headers: headers,
        param: JSON.stringify(body),
        success : (res) => {
            console.log('success');
            console.error(res)
        },
        error : (xhr, e) => {
            console.error('error');
            console.error(e);
        },
    };

    requestAjax(options);
}


function init() {

    setInterval(() => {

        const currTime = getCurrTime();
        if (currTime.startsWith('07:00')) {
            checkCalendar();
        }
    }, 10 * 1000);

    //checkCalendar();
}

init();
