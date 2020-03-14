chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	console.error('content-script')
	console.error(message)
	console.error('sender : ' + sender)

	if (message.action == 'check-exist-item-option') {
		//console.error('length :  ' + $("._combination_option").length);

		if ($("._combination_option").length > 0) {

		}
	}
});

