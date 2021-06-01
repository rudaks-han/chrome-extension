
const slackChannel = ''; // test-channel

function checkCalendar() {
    let currDate = getCurrDate();
    //currDate = '2021-05-31';

    //let currentDate = new Date(currDate + '/00:00:00');
    let currentDate = new Date();
    if (currentDate.getDay() == 0 || currentDate.getDay() == 6) { // 토, 일 제외
        console.log('금일은 휴일(토/일)입니다.' + currentDate)
        return;
    }

    const options = {
        method: 'get',
        url: 'https://spectra.daouoffice.com/api/calendar/event?timeMin=' + currDate + 'T00%3A00%3A00.000%2B09%3A00&timeMax=' + currDate + 'T23%3A59%3A59.999%2B09%3A00&includingAttendees=true&calendarIds%5B%5D=8452&calendarIds%5B%5D=8987&calendarIds%5B%5D=11324&calendarIds%5B%5D=11326',

        success : (res) => {
            if (isHoliday(res)) {
                console.log('금일은 휴일(holiday)입니다: ' + currDate);
                return;
            }

            checkDayoff(res);
            checkQuality();
        },
        error : (xhr, e) => {
            console.error('error');
            console.error(e);
        },
    };

    requestAjax(options);
}

function isHoliday(response) {
    let holiday = false;
    let currDate = getCurrDate();
    response.data.map(item => {
        if (item.type == 'holiday') {
            const endTime = item.endTime;

            if (endTime.startsWith(currDate)) {
                console.log('금일은 휴일(holiday)입니다: ' + currDate);
                holiday = true;
            }
        }
    });

    return holiday;
}

function checkDayoff(response) {
    const members = [
        '허동혁', '김용익', '한경만', '조승열', '심재희', '유민', '김성윤', '정은영', '노용주',
        '이상헌', '장진혁', '김재현', '홍경택', '천규리',
        '김지훈', '이정호', '전소희', '박정균',
        '김선숙', '김호진',
        '박은규',
        '김현호'
        //'정재헌', '김지홍'
        //'유승화'
        //'백명구', '최학석'
    ];

    let message = '';

    response.data.map(item => {
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

    let currDate = getCurrDate();
    if (message.length > 0) {
        message = `[${currDate}] 금일 연차 현황\n${message}`;
        slack.send(slackChannel, message);
    }
}

function checkQuality() {
    const qualityChecker = new QualityChecker();

    qualityChecker.startCheck()
        .then(responses => {

            let hasError = false;
            let messages = '';
            responses.map(response => {
                if (response.hasError) {
                    console.error(response)
                    hasError = true;
                    messages += '[' + response.componentName + '] ' + response.message + '\n';
                }
            });

            if (hasError) {
                let errorMessage = 'Sonarqube에 오류가 있으니 수정하시기 바랍니다. (http://211.63.24.41:9000/projects) \n';
                errorMessage += '' + messages;

                slack.send(slackChannel, errorMessage);
            }
        });
}

function init() {
    setInterval(() => {
        const currTime = getCurrTime();
        if (currTime.startsWith('07:00')) { // 07시에 알림
            checkCalendar();
        }
    }, 60 * 1000);

    //checkCalendar();
    //checkQuality();
}

init();
