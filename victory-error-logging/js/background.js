let consolePaneTabId;

const receiveMessage = function(request, sender, sendResponse) {
    console.log('background request', request);

    if (request.action == 'capture') {
        chrome.tabs.captureVisibleTab({format: 'png'}, function(data) {
            request.image = data;

            captureWindow(request);

            /*chrome.tabs.sendMessage(tab.id, {content: "message"}, function(response) {
                if(response) {
                    //We do something
                }
            });*/

            //chrome.extension.sendRequest({message: 'captured.....'});

            chrome.tabs.getSelected(null, function(tab) {
                console.log('tab.id: ' + tab.id);
                chrome.tabs.update(tab.id, {'active': true}, (tab) => { });
                //chrome.tabs.sendRequest(tab.id, 'captured.....', function() {});
                chrome.tabs.sendMessage(tab.id, {
                    'action': 'captured',
                    'image': data
                }, function() {});
            });
        });
    }
}

chrome.runtime.onMessage.addListener(receiveMessage);


var captureWindow = function(request) {
    console.log(request);
};

