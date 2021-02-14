const receiveMessage = (request, sender, sendResponse) => {
    console.log('background request', request);

    switch (request.action) {
        case 'capture':
            captureCurrentTab(request);
            break;
        case 'change-useflag':
            changeUseFlag(request);
            break;
        default:
            console.error('undefined action: ' + request.action);
            break;
    }
}

chrome.runtime.onMessage.addListener(receiveMessage);

function captureCurrentTab(request) {
    chrome.tabs.captureVisibleTab({format: 'png'}, data => {
        chrome.tabs.getSelected(null, tab => {
            //chrome.tabs.update(tab.id, {'active': true}, (tab) => { });
            chrome.tabs.sendMessage(tab.id, {
                action: 'captured',
                nextAction: request.nextAction,
                image: data
            }, () => {});
        });
    });
}

function changeUseFlag(request) {
    chrome.tabs.getSelected(null, tab => {
        chrome.tabs.sendMessage(tab.id, {
            action: 'change-useflag',
            value: request.value
        }, () => {});
    });
}