
const jq = jQuery.noConflict(true);

jq(function() {
    loadIcon();
})

function injectScript(file) {
    script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", chrome.extension.getURL(file));
    document.documentElement.appendChild(script);
    document.documentElement.removeChild(script);
}

function injectCss(file) {
    css = document.createElement('link');
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("href", chrome.extension.getURL(file));
    document.documentElement.appendChild(css);
    document.documentElement.removeChild(css);
}

injectScript('js/injected.js');
injectScript('js/jsonview.js');
injectScript('js/consoleHtml.js');
injectCss('css/console-log.css')

function loadIcon() {

    var iconHtml = '<div class="ui">\n' +
        '  <a class="item">\n' +
        '    <i class="icon mail"></i> Victory Error\n' +
        '    <div class="badge">' +
        '' +
        '    </div>\n' +
        '  </a>\n' +
        '</div>\n';

    var html = '<div id="victory-log">\n'
        + headerLayer()
        + iconHtml
        + logLayer()
        + '</div>';

    jq('body').append(html);
    jq('#new-window-console-pane').on('click', function() {
        console.log('click');
        json = '{"aa":"bb"}'
        chrome.runtime.sendMessage({'cmd': 'openConsole', 'data': _xhrErrors});
    })
}

var _xhrErrors = [];

function addErrorLog(json) {
    _xhrErrors.push(json);

    try {
        if (json) {
            const module = json.responseText.module;
            const code = json.responseText.code;
            const message = json.responseText.message;

            var html = '<li>';
            html += '<div>';
            html += '[' + module + '][' + code +'] ' + message;
            html += '</div>';
            html += '<div class="detail-log">';
            html += '</div>';
            html += '</li>';

            jq('.xhr-error-panel > ul').append(html);
            JsonView.renderJSON(json, jq('.detail-log:last').get(0));

            addBadgeCount();

            chrome.runtime.sendMessage({'cmd': 'sendLog', 'data': json});
        }
    } catch (e) {
        console.error(e);
    }
}

function addBadgeCount() {
    jq('#victory-log').find('.badge').text(_xhrErrors.length);
    jq('#victory-log').find('.badge').css({'display':'block'});
}

document.addEventListener('xhrErrorEvent', function (e) {
    var json = e.detail;
    console.log('received', json);

    addErrorLog(json);
});

