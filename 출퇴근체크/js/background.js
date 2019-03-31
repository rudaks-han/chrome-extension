
let GOSSOcookie = '';

let checkInterval = 60 * 1000;
//let userSessionInterval = 10 * 60 * 1000; // 10분 마다
let userSessionInterval = 5 * 1000; // 10분 마다
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

function init() {
    // 사용여부 체크
    chrome.storage.sync.get('use-flag', function (items) {

        let useFlag = items['use-flag'];

        if (useFlag == 'Y')
        {
            check();
        }
        else
        {
            log('>>> 출퇴근 체크가 사용하지 않음으로 설정되어 있습니다.');
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
        }, userSessionInterval); // 세션정보 10분마다 가져온다.

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
var receiveMessage = function(request, sender, sendResponse)
{
	console.log('receiveMessage');
	console.log(request);
	if (request.action == 'gotoDaouoffice')
	{
		window.open('https://spectra.daouoffice.com');
	}
	else if (request.action == 'notification')
    {
        showNotify(request.title, request.message);
    }
    else if (request.action == 'getUserSessionInfo')
    {
        login();
    }
}



/**
 * receiver by chrome.runtime.sendMessage
 */
chrome.runtime.onMessage.addListener(receiveMessage);


function showNotify(title, message) {
    if (Notification && Notification.permission !== "granted") {
        Notification.requestPermission(function (status) {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
        });
    }
    if (Notification && Notification.permission === "granted") {
        //var n = new Notification(title + "\n" + message);

        var start = Date.now();
        var id = new Date().getTime() + '';
        var options = {
            type: 'basic',
            iconUrl: '/images/icon.png',
            title: title,
            message: message
        };

        chrome.notifications.create(id, options, function() {
            setInterval(function() {
                var time = Date.now() - start;
                chrome.notifications.update(id, {
                    message,
                }, function() { });
            }, 1000);
        });

        chrome.notifications.onClicked.addListener(function(notificationId, byUser) {
            //chrome.tabs.create({url: "http://www.google.com"});
            chrome.notifications.clear(notificationId, function() {});
        });
    }

}

function login()
{
    var username = "2014001";
    var password = "xkdla10@";

    var param = '{"captcha": "", "username": "' + username + '", "password": "' + password + '", "returnUrl": ""}';
    var guid = uuidv4();

    var options = {
        method: 'post',
        url: BASE_URL + '/api/login',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        headers: {'Set-Cookie': guid + '; Path=/'},
        param: param,
        success : function(res) {
            chrome.cookies.get({ url: 'https://spectra.daouoffice.com', name: 'GOSSOcookie' },
                function (cookie) {
                    if (cookie) {
                        console.log("GOSSOcookie : " + cookie.value);
                        //GOSSOcookie = cookie.value;

                        requestUserSession();
                    }
                    else {
                        console.log('Can\'t get cookie! Check the name!');
                    }
                });
        },
        error : function(xhr) {
            console.log("Login error : " + JSON.stringify(xhr))
        }
    };

    requestAjax(options);
}

function requestUserSession() {
    let options = {
        method: 'get',
        url: BASE_URL + '/api/user/session',
        success : function(res) {
            sessionUserId = res.data.id;
            sessionUserName = res.data.name;

            console.log('사용자 세션정보 요청 : ' + sessionUserName + '[' + sessionUserId + ']');
        },
        error : function(xhr) {
            console.error('사용자 세션정보 요청 실패 : ' + xhr);
        }
    };

    requestAjax(options);
}