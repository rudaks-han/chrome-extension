chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	console.error('content-script')
	console.error(message)
	console.error('sender : ' + sender)

	if (message.action == 'check-exist-item-option') {
		//console.error('length :  ' + $("._combination_option").length);

		if ($("._combination_option").length > 0) {

		}
	} else if (message.action == 'reload-count') {
		maxReloadCount = message.data.maxReloadCount;
		reloadCount = message.data.reloadCount;
		$('.prd_name').append('<div style="color:red; font-size:20px">' + reloadCount + '/' + maxReloadCount + '번째 시도중...</div>');
	}
});

