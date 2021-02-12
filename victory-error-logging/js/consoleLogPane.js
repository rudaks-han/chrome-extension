$(function() {
    $('.clear-console-log').on('click', function() {
        clearConsoleLog();
        sendMessageToParent({
            'action': 'clear-console-log'
        });
    });

    $('.close-console-pane').on('click', function() {
        sendMessageToParent({
            'action': 'close-console-pane'
        });
    });

    $('.capture-screen').on('click', function() {
        sendMessageToParent({
            'action': 'capture-screen'
        });
    });
});

function sendMessageToParent(msg) {
    window.parent.postMessage(msg, '*');
}

function appendLog(type, data) {
    console.log('#consoleLogPane.js', type, data)

    let title = 'No Title';
    switch (type) {
        case 'xhr':
            const module = data.responseText ? data.responseText.module : 'NoModule';
            const code = data.responseText ? data.responseText.code : 'NoCode';
            const message = data.responseText ? data.responseText.message : 'NoMessage';

            title = `[${module}][${code}] ${message}]`;
            break;
        case 'js':
            title = `${data.text} ${data.url}:${data.line}`;
            break;
        case 'websocket':
            title = `[${data.eventType}]`;
            break;
        default:
            if (typeof data === 'object') {
                title = JSON.stringify(data);
            } else {
                title = data;
            }

            console.error('unknown type', data);
    }

    const html = `<li>
                    <div>[${type}] ${title}</div>
                    <div class="detail-log"></div>
                  </li>`;

    $('.xhr-error-panel').find('ul').append(html);
    JsonView.renderJSON(data, $('.detail-log:last').get(0));
}

function clearConsoleLog() {
    $('.xhr-error-panel').find('ul').find('li').remove();
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.cmd) {
        case 'sendLog':
            appendLog(request.type, request.data);
            break;
        case 'openConsole':
            request.data.forEach((data, index) => {
                appendLog(request.type, data);
            });
            break;
        case 'clearConsoleLog':
            clearConsoleLog();
            break;

    }
});
