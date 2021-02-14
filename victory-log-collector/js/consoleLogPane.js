$(() => {
    $('.btn-clear-console-log').on('click', () => {
        clearConsoleLog();
        sendMessageToParent({
            'action': 'clear-console-log'
        });
    });

    $('.btn-close-console-pane').on('click', () => {
        sendMessageToParent({
            'action': 'close-console-pane'
        });
    });

    $('.btn-copy-console-log').on('click', () => {
        sendMessageToParent({
            'action': 'copy-console-log'
        });
    });

});

function sendMessageToParent(msg) {
    window.parent.postMessage(msg, '*');
}

function appendLog(type, data) {
    console.log('____consoleLogPane.js', type, data)

    let title = 'No Title';
    switch (type) {
        case 'xhr':
            const module = data.responseText ? data.responseText.module : 'NoModule';
            const code = data.responseText ? data.responseText.code : 'NoCode';
            const message = data.responseText ? data.responseText.message : 'NoMessage';

            title = `[${module}][${code}] ${message}]`;
            break;
        case 'js':
            title = '';
            if (data.text)
                title = `${data.text} `;
            if (data.url)
                title += `${data.url}`;
            if (data.line)
                title += `:${data.line}`;
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

    scrollToBottom();
}

function scrollToBottom() {
    setTimeout(function() {
        $('.xhr-error-panel').find('ul').scrollTop(10000000);
    }, 100);
}

function clearConsoleLog() {
    $('.xhr-error-panel').find('ul').find('li').remove();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.cmd) {
        case 'sendLog':
            appendLog(request.type, request.data);
            break;
        case 'clearConsoleLog':
            clearConsoleLog();
            break;
    }
});
