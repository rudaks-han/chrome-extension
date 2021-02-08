var consolePaneTabId;

chrome.runtime.onMessage.addListener(function(message){
    console.log('message: ' + JSON.stringify(message));
    if (message.cmd == "openConsole") {
        chrome.tabs.create({url:'consoleLogPane.html'}, function(tab) {
            consolePaneTabId = tab.id;
            chrome.tabs.sendMessage(consolePaneTabId, message.data);
        });
    } else if (message.cmd == 'sendLog') {
        //consolePaneTabId.document.write('111')
        chrome.tabs.sendMessage(consolePaneTabId, message.data);
    } else if (message.cmd == 'clearConsoleLog') {
        //chrome.tabs.sendMessage(consolePaneTabId, message.data);

        chrome.tabs.getAllInWindow(null, function(tabs){
            for (var i = 0; i < tabs.length; i++) {
                chrome.tabs.sendMessage(tabs[i].id, message, function(response) {
                   console.log('result')
                });
            }
        });


    }
});

var websocket;
function createWebSocketConnection() {

    var host = 'wss://victory-buzzer.spectra.co.kr/';

    console.log('----')
    if ('WebSocket' in window) {
        websocket = new WebSocket(host);
        console.log("======== websocket ===========");
        console.log(websocket);

        websocket.onopen = function () {
            console.log('_______onopen')
            websocket.send("Hello");
        };

        websocket.onmessage = function (event) {
            console.log('_______ onmessage')
            var received_msg = JSON.parse(event.data);
            var notificationOptions = {
                type: "basic",
                title: received_msg.title,
                message: received_msg.message,
                iconUrl: "extension-icon.png"
            }

            console.error('data:' + event.data);
            chrome.notifications.create("", notificationOptions);
        };

        websocket.onclose = function () {
        }
    }
}

createWebSocketConnection();

const networkFilters = {
    urls: [
        "wss://victory-buzzer.spectra.co.kr/*"
    ]
};

chrome.webRequest.onBeforeRequest.addListener((details) => {
    const { tabId, requestId } = details;
    console.log('websocket start...')
    // do stuff here
}, networkFilters);