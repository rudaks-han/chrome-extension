
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
    var iconHtml = '<div class="icon-display">' +
        '   <div class="icon-display-img-div">' +
        '       <img src="' + chrome.runtime.getURL("images/icons8-box-important-48.png") + '" />' +
        '   </div>' +
        '   <div class="badge-num">' +
        '' +
        '   </div>' +
        '   <div class="iframe-console-log">' +
        '       <iframe width="100%" height="100%" frameborder="0">' +
        '       </iframe>' +
        '   </div>' +
        '</div>'

    var html = '<div id="victory-log">'
        + iconHtml
        + '</div>';

    $('body').append(html);

    $('.iframe-console-log > iframe').attr('src', chrome.runtime.getURL('consoleLogPane.html'));
    $('.icon-display-img-div').on('click', function() {
        if ($('.iframe-console-log').is(':visible')) {
            $('.iframe-console-log').css({'display': 'none'});
        } else {
            $('.iframe-console-log').css({'display': 'block'});
        }
    })

}

var _xhrErrors = [];

function addErrorLog(type, json) {
    _xhrErrors.push(json);

    console.log('addErrorLog: ' + type);
    console.log(json);

    try {
        if (json) {
            addBadgeCount();

            chrome.runtime.sendMessage({'cmd': 'sendLog', 'type': type, 'data': json});
        }
    } catch (e) {
        console.error(e);
    }
}

function addBadgeCount() {
    $('#victory-log').find('.badge-num').text(_xhrErrors.length);
    $('#victory-log').find('.badge-num').css({'display':'flex'});
}



document.addEventListener('ErrorToExtension', function (e) {
    var json = e.detail;
    console.log('___________ ErrorToExtension received __________');
    console.log(json);
    console.log('_________________________________');

    addErrorLog('js', json);
});

document.addEventListener('xhrErrorEvent', function (e) {
    var json = e.detail;
    console.log('xhrErrorEvent received', json);

    addErrorLog('xhr', json);
});


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('content-script#onMessage');
        console.log(request);

    }
);

