
let GOSSOcookie = '';

let checkInterval = 5 * 1000;
let userSessionInterval = 5 * 60 * 1000; // 5분 마다
let calendarCheckInterval = 60 * 60 * 1000; // 1시간 마다

let sessionUserName;
let sessionUserId;

// 로그인 정보
let username;
let password;

let syncStorage = {};
let userConfig = {}; // 로그인 사용자 정보
let holidayList = {}; // 휴일정보
let dayOffList = {}; // 연차

let clockInRandomTime = {}; // 출근시간 마크시간(랜덤)
let clockOutRandomTime = {}; // 퇴근시간 마크시간(랜덤)

function init() {
    // 사용여부 체크
    getChromeStorageSync('use-flag', (items) => {
        let useFlag = items['use-flag'];

        if (useFlag == 'Y')
        {
            check();
        }
        else
        {
            logger.info('>>> 출퇴근 체크가 사용하지 않음으로 설정되어 있습니다.');
        }
    });
}

init();

const workHourChecker = new WorkHourChecker();

function check() {
    const userSession = new UserSession();
    userSession.getSession();

    let promises =
        [
            workHourChecker.getUserConfig(),
            userSession.getSession(),
            workHourChecker.requestCalendar()
        ];

    $.when.apply($, promises).then(() => {
        setInterval(() => {
            userSession.getSession()
        }, userSessionInterval); // 세션정보 1분마다 가져온다.

        setInterval(() => {
            workHourChecker.requestCalendar()
        }, calendarCheckInterval); // 달력정보 1시간마다 가져온다.

        setInterval(() => {
            workHourChecker.checkStartWorkTime();
        }, checkInterval); // 출퇴근시간 체크 (1분마다 체크)
    });
}

/**
 * popup에서 오는 메시지를 받는 함수
 */
let receiveMessage = function(request, sender, sendResponse)
{
	logger.debug('receiveMessage');
    //logger.debug(JSON.stringify(request));
	if (request.action == 'gotoDaouoffice')
	{
		window.open('https://spectra.daouoffice.com');
	}
	else if (request.action == 'notification')
    {
        console.error('action notification')
        showBgNotification(request.title, request.message, request.requireInteraction);
    }
    else if (request.action == 'btnClockIn')
    {
        const userSession = new UserSession();
        userSession.loginAfterGetStorage(function() {
            const workHourMarker = new WorkHourMarker();
            workHourMarker.requestClockIn();
        });
    }
    else if (request.action == 'btnClockOut')
    {
        const userSession = new UserSession();
        userSession.loginAfterGetStorage(function() {
            const workHourMarker = new WorkHourMarker();
            workHourMarker.requestClockOut();
        });
    }
}



/**
 * receiver by chrome.runtime.sendMessage
 */
chrome.runtime.onMessage.addListener(receiveMessage);


function showBgNotification(title, message, requireInteraction = false) {

    if (Notification && Notification.permission !== "granted") {
        Notification.requestPermission(function (status) {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
        });
    }
    if (Notification && Notification.permission === "granted") {
        let start = Date.now();
        let id = new Date().getTime() + '';
        let options = {
            type: 'basic',
            iconUrl: '/images/icon.png',
            title: title,
            message: message,
            requireInteraction: requireInteraction
        };

        /*chrome.notifications.create(id, options, function() {
            setInterval(function() {
                var time = Date.now() - start;
                chrome.notifications.update(id, {
                    message,
                }, function() { });
            }, 1000);
        });*/

        chrome.notifications.create(options);

        chrome.notifications.onClicked.addListener(function(notificationId, byUser) {
            chrome.notifications.clear(notificationId, function() {});
        });
    }

}