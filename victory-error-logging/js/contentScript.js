
//const jq = jQuery.noConflict(true);

$(function() {
    loadIcon();

    setTimeout(function() {
        for (let i=0; i<10; i++)
            sample();
    }, 500);

    addDraggableEvent(document.getElementById("iframe-console-log"));

    $('#capture-screen').on('click', function(e) {
        captureScreen();
    })
})

function sample() {
    data = {url: "//victory-agent-gateway.spectra.co.kr/mocha/login", data: '{"userId":"kmhan","password":"1","force":false}', status: "401", responseText: {}};

    addErrorLog('none', data, true);
}

injectScript('js/injected.js');
injectScript('js/jsonview.js');
injectCss('css/console-log.css')

function loadIcon() {
    const html = `
        <div id="victory-log-icon">
           <div class="icon-display-img-div">
               <img title="Victory Log Tracer" src="${chrome.runtime.getURL("images/icons8-box-important-48.png")}" />
           </div>
           <div class="badge-num"></div> 
        </div>
       <div id="iframe-console-log">
           <div class="body-layer">
                <div class="drag-layer">
                    <img id="drag-console-layer" src="${chrome.runtime.getURL("images/drag-32.png")}" style="position: absolute; top:-35px; right: 10px; cursor:move;"/>
                </div>
                <iframe id="console-frame" width="100%" height="100%" frameborder="0" scrolling="yes" style="z-index:1">
           </div>
           </iframe>
       </div>`

    $('body').append(html);

    $('#iframe-console-log').find('iframe').attr('src', chrome.runtime.getURL('consoleLogPane.html'));
    $('.icon-display-img-div').on('click', function() {
        if ($('#iframe-console-log').is(':visible')) {
            //$('#iframe-console-log').css({'display': 'none'});
        } else {
            $('#iframe-console-log').css({'display': 'block'});
        }
    });
}

let _xhrErrors = [];

function addErrorLog(type, json, countBadgeCount) {
    _xhrErrors.push(json);

    try {
        if (json) {
            if (countBadgeCount) {
                addBadgeCount() ;
            }

            chrome.runtime.sendMessage({'cmd': 'sendLog', 'type': type, 'data': json});
        }
    } catch (e) {
        console.error(e);
    }
}

function addBadgeCount() {
    $('#victory-log-icon').find('.badge-num').text(_xhrErrors.length);
    $('#victory-log-icon').find('.badge-num').css({'display':'flex'});
}

function clearConsoleLog() {
    _xhrErrors = [];
    $('#victory-log-icon').find('.badge-num').text('');
    $('#victory-log-icon').find('.badge-num').css({'display':'none'});
}

function closeConsolePane() {
    //$('#victory-log-icon').find('.badge-num').text(0);
    $('#iframe-console-log').css({'display':'none'})
}

function captureScreen() {
    chrome.runtime.sendMessage({action: "capture"}, function(response) {});
}

window.addEventListener('message', function(e) {
    if (e.data && e.data.eventType) {
        addErrorLog('websocket', e.data, false);
    } else if (e.data.action === 'close-console-pane') {
        closeConsolePane();
    } else if (e.data.action === 'clear-console-log') {
        clearConsoleLog();
    } else if (e.data.action === 'capture-screen') {
        captureScreen();
    } else if (e.data.action === 'captured') {
        copyToClipboard(e, e.data.image, function() {
            console.log('copied to clipboard.');
            alert('화면이 클립보드에 복사되었습니다.')
        });
    } else {
        console.log('message received', e.data);
    }

});

document.addEventListener('message', function (e) {
    console.log('message', e);
});

document.addEventListener('ErrorToExtension', function (e) {
    addErrorLog('js', e.detail, true);
});

document.addEventListener('xhrErrorEvent', function (e) {
    addErrorLog('xhr', e.detail, true);
});

chrome.runtime.onMessage.addListener(function(request, sender) {
    console.log('contentScript onMessage', request);
    if (request.action === 'captured') {
        window.parent.postMessage(request, '*');
    }
});



