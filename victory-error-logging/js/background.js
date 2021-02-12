let consolePaneTabId;

const receiveMessage = function(request, sender, sendResponse) {
    console.log('background request', request);

    if (request.action == 'capture') {
        chrome.tabs.captureVisibleTab({format: 'png'}, function(data) {
            chrome.tabs.getSelected(null, function(tab) {
                chrome.tabs.update(tab.id, {'active': true}, (tab) => { });
                chrome.tabs.sendMessage(tab.id, {
                    action: 'captured',
                    nextAction: request.nextAction,
                    image: data
                }, function() {});
            });
        });
    }
}

chrome.runtime.onMessage.addListener(receiveMessage);

