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
        console.log('request actoin......')
        var BASE_URL = 'https://spectra.daouoffice.com';

        var options = {
            method: 'get',
            url: BASE_URL + '/api/user/session',
            success : function(res) {
                sessionUserId = res.data.id;
                sessionUserName = res.data.name;

                //log('사용자 세션정보 요청 : ' + sessionUserName + '[' + sessionUserId + ']');

                showNotify('사용자 정보', '현재 [' + sessionUserName + ']님 으로 로그인 되어 있습니다.');
            },
            error : function(xhr) {
                console.log("getUserSessionInfo error : " + JSON.stringify(xhr))
                showNotify('사용자 정보', '사용자 정보 조회 실패. ' + xhr.responseText);
            }
        };

        requestAjax(options);

    }
}

function requestAjax(options)
{
    console.log('======= Ajax Request ======');
    console.log('[url] ' + options.url);
    console.log('[method] ' + options.method);
    console.log('[headers] ' + options.headers);
    console.log('[data] ' + options.data);
    console.log('=========================');

    return $.ajax({
        type: options.method,
        url: options.url,
        headers: options.headers,
        data: options.param,
        dataType: "json",
        contentType: "application/json", // request payload로 전송됨
        success : options.success,
        error : options.error,
        complete : options.complete
    });
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
