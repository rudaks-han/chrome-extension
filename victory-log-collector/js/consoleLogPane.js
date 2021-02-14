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
    let title = '';
    switch (type) {
        case 'xhr':
            if (data.responseText) {
                if ((data.responseText.status+'').startsWith('4')) {
                    if (data.responseText.module)
                        title += `[${data.responseText.module}]`;
                    if (data.responseText.code)
                        title += `[${data.responseText.code}]`;
                    if (data.responseText.message)
                        title += `[${data.responseText.message}`;
                } else if ((data.responseText.status+'').startsWith('5')) {
                    title += `[${data.responseText.status}]`;
                    title += `[${data.responseText.error}]`;
                    title += `[${data.responseText.path}]`;
                } else {
                    title = JSON.stringify(data);
                }
            }

            break;
        case 'js':
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
