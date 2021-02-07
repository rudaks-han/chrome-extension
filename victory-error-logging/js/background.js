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