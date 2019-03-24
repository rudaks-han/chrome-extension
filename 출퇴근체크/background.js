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
            iconUrl: '/images/rolling-icon.png',
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
