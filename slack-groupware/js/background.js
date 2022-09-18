// C01FRS7V830 31-개발팀-backend
// C01FJRQF8KX 30-victory-개발팀
// C01T21V0GG6 test-channel
const isTestMode = false;
const slackChannelDevelop = 'C01FJRQF8KX'; // 30-victory-개발팀
const slackChannelTest = 'C01T21V0GG6'; // test-channel
let slackChannel = slackChannelDevelop; // test-channel
if (isTestMode) {
    slackChannel = slackChannelTest;
}

const members = [
    '허동혁', '김용익', '한경만', '조승열', '심재희', '유민', '김성윤', '정은영', '노용주', '유지현', '이예지',
    '이상헌', '장진혁', '김재현', '허소정', '천규리', '양진규', '신미란', '함종혁',
    '김지훈', '이정호', '전소희', '박정균',
    '김선숙',
    '박은규', '이승엽', '정가을', '조성빈',
    //'김현호'
    //'정재헌', '김지홍'
    //'유승화'
    //'백명구', '최학석'
];

function request() {
    //let currentDate = new Date(currDate + '/00:00:00');
    let currentDate = new Date();
    if (currentDate.getDay() == 0 || currentDate.getDay() == 6) { // 토, 일 제외
        console.log('금일은 휴일(토/일)입니다.' + currentDate)
        return;
    }

    Promise.resolve()
        .then(() => checkTodayCalendar())
        .then(() => checkNextDayCalendar())
        .then(() => checkQuality());
}

function checkTodayCalendar() {
    let currDate = getCurrDate();

    Promise.resolve()
        .then(() => checkCalendar(currDate))
        .then((res) => checkDayoff('금일 연차 현황', currDate, res));
}

function checkNextDayCalendar() {
    let currDate = getCurrDate();
    //currDate = '2021-11-12';
    let addDay = 1;
    //let currentDate = new Date();
    let currentDate = new Date(currDate + '/00:00:00');
    const weekday = currentDate.getDay();
    if (weekday === 5) {// 금
        addDay = 3; // 월
    }
    const nextDate = toDateString(new Date(currDate).addDays(addDay));
    console.error('nextDate: ' + nextDate);

    Promise.resolve()
        .then(() => checkCalendar(nextDate))
        .then((res) => checkDayoff('내일 연차 현황', nextDate, res));
}

function checkCalendar(currDate) {
    const options = {
        method: 'get',
        url: 'https://spectra.daouoffice.com/api/calendar/event?timeMin=' + currDate + 'T00%3A00%3A00.000%2B09%3A00&timeMax=' + currDate + 'T23%3A59%3A59.999%2B09%3A00&includingAttendees=true&calendarIds%5B%5D=8452&calendarIds%5B%5D=8987&calendarIds%5B%5D=11324&calendarIds%5B%5D=11326',

        success : (res) => {
            if (isHoliday(res)) {
                console.log('금일은 휴일(holiday)입니다: ' + currDate);
                return;
            }
        },
        error : (xhr, e) => {
            console.error('error');
            console.error(e);
        },
    };

    return requestAjax(options);
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

function checkDayoff(title, date, response) {
    let dayOffMessage = parseDayoff(response);
    if (dayOffMessage.length > 0) {
        const message = `[${date}] ${title}\n${dayOffMessage}`;
        slack.send(slackChannel, message);
    }
}

function parseDayoff(response) {
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
                        console.log('>>> ' + type + ': ' + user);
                        message += type + ': ' + user + '\n';
                    }
                }
            }
        }
    });

    return message;
}

function checkQuality() {
    const qualityChecker = new QualityChecker();

    qualityChecker.startCheck()
        .then(responses => {

            let hasError = false;
            let messages = '';
            responses.map(response => {
                if (response.hasError) {
                    console.log(response)
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
            request();
        }
    }, 60 * 1000);
}

init();

if (isTestMode) {
    request();
}

//checkQuality();
