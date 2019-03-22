/**
 * popup에서 오는 메시지를 받는 함수
 */
var receiveMessage = function(request, sender, sendResponse)
{
	if (request.action == 'gotoDaouoffice')
	{
		window.open('https://spectra.daouoffice.com');
	}
}


/**
 * receiver by chrome.runtime.sendMessage
 */
chrome.runtime.onMessage.addListener(receiveMessage);