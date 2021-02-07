
//const jq = jQuery.noConflict(true);

$(function() {
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
    /*var iconHtml = '<div class="ui">\n' +
        '  <a class="item">\n' +
        '    <i class="icon mail"></i> Victory Error\n' +
        '    <div class="badge">' +
        '' +
        '    </div>\n' +
        '  </a>\n' +
        '</div>\n';*/

    var imgUrl = chrome.runtime.getURL("images/icons8-box-important-48.png");

    var iconHtml = '<div class="icon-display">' +
        '   <div class="icon-display-img-div">' +
        '       <img src="' + imgUrl + '" />' +
        '   </div>' +
        '   <div class="badge-num">' +
        '' +
        '   </div>' +
        '</div>'

    var html = '<div id="victory-log">\n'
        //+ headerLayer()
        + iconHtml
        //+ logLayer()
        + '</div>';

    $('body').append(html);
    $('.icon-display-img-div').on('click', function() {
        chrome.runtime.sendMessage({'cmd': 'openConsole', 'data': _xhrErrors});
    })
}

var _xhrErrors = [];

function addErrorLog(json) {
    _xhrErrors.push(json);

    console.log('addErrorLog');
    console.log(json);

    try {
        if (json) {
            /*const module = json.responseText.module;
            const code = json.responseText.code;
            const message = json.responseText.message;

            var html = '<li>';
            html += '<div>';
            html += '[' + module + '][' + code +'] ' + message;
            html += '</div>';
            html += '<div class="detail-log">';
            html += '</div>';
            html += '</li>';

            $('.xhr-error-panel > ul').append(html);
            JsonView.renderJSON(json, $('.detail-log:last').get(0));*/

            addBadgeCount();

            chrome.runtime.sendMessage({'cmd': 'sendLog', 'data': json});
        }
    } catch (e) {
        console.error(e);
    }
}

function addBadgeCount() {
    $('#victory-log').find('.badge-num').text(_xhrErrors.length);
    $('#victory-log').find('.badge-num').css({'display':'flex'});
}

function clearBadgeCount() {
    $('#victory-log').find('.badge-num').text('');
    $('#victory-log').find('.badge-num').css({'display':'none'});
}

document.addEventListener('xhrErrorEvent', function (e) {
    var json = e.detail;
    console.log('received', json);

    addErrorLog(json);
});


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('content-script#onMessage');
        console.log(request);

        if (request.cmd == 'clearConsoleLog') {
            $('#victory-log').find('.badge-num').text('');
            $('#victory-log').find('.badge-num').css({'display':'none'});
            //clearBadgeCount();
            /*chrome.tabs.executeScript({
                code: 'alert($("#victory-log").length)'
            });*/
        }
    }
);

