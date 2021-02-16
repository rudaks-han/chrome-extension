const receiveMessage = (request, sender, sendResponse) => {
    switch (request.action) {
        case 'capture':
            captureCurrentTab(request);
            break;
        case 'change-useflag':
            changeUseFlag(request);
            break;
        case 'openwindow':
            openWindow(request);
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

let isTabOpen = false;
let openedTab = 0;
function openWindow(request) {

    if (!isTabOpen){
        chrome.tabs.create({selected: true},function(tab){
            isTabOpen= true;
            openedTab = tab.id;
            tabCreated(request.url);
        });
    } else {
        chrome.tabs.get(openedTab, function(tab) {

            if (chrome.runtime.lastError) {
                chrome.tabs.create({selected: true},function(tab){
                    isTabOpen= true;
                    openedTab = tab.id;
                    tabCreated(request.url);
                });
            } else {
                console.log(1)
                tabCreated(request.url);
            }
        });

    }
}

function tabCreated(url){
    chrome.tabs.update(openedTab, {'active': true, url:url});
}