
//const jq = jQuery.noConflict(true);

$(function() {
    loadIcon();

    setTimeout(function() {
        for (let i=0; i<10; i++)
            sample();
    }, 500);

    addDraggableEvent(
        document.getElementById("victory-log-tracer"),
        document.getElementById("drag-layer-img")
    );

    $('#capture-screen').on('click', function(e) {
        captureScreen();
    });

    $('#view-console').on('click', function(e) {
        viewConsole();
    });

    $('#upload-dropbox').on('click', function(e) {
        uploadLogToDropbox();
    });
})

function sample() {
    const data = {
        url: "//victory-agent-gateway.spectra.co.kr/mocha/login",
        data: '{"userId":"kmhan","password":"1","force":false}',
        status: "400",
        responseText: {
            error: true,
            code: 400104,
            message: 'The request specifies an error occurred while mapping ``JSON`` to object',
            detailMessage: 'Validation failed for argument [0] in public spectra.attic.talk.mocha.authenticate.authenticate.sdo.LoginTokenWithClientIdRdo spectra.attic.talk.mocha.authenticate.authenticate.controller.LoginController.login(spectra.attic.talk.mocha.authenticate.authenticate.sdo.LoginCdo,javax.servlet.http.HttpServletRequest): [Field error in object \'loginCdo\' on field \'userId\': rejected value [af]; codes [Size.loginCdo.userId,Size.userId,Size.java.lang.String,Size]; arguments [org.springframework.context.support.DefaultMessageSourceResolvable: codes [loginCdo.userId,userId]; arguments []; default message [userId],20,3]; default message [크기가 3에서 20 사이여야 합니다]]',
            module: 'mocha'
        }};

    addErrorLog('xhr', data, true);
}

injectScript('js/injected.js');
injectScript('js/lib/jsonview.js');
injectCss('css/console-log.css')

function loadIcon() {
    const html = `
       <div id="victory-log-tracer">
            
           <div id="victory-log-icon">
               <div class="icon-display-img-div">
                   <img title="Victory Log Tracer" src="${chrome.runtime.getURL("images/icons8-box-important-48.png")}" />
               </div>
               <div class="badge-num"></div>
               
               <div class="speed-dial">
                    <div class="drag-layer">
                        <img title="이동" id="drag-layer-img" src="${chrome.runtime.getURL("images/drag-32.png")}" />
                    </div>
                    
                    <div>
                        <img title="Dropbox로 보내기" id="upload-dropbox" src="${chrome.runtime.getURL("images/dropbox.png")}" />
                    </div>
                    <div>
                        <img title="화면 캡처" id="capture-screen" src="${chrome.runtime.getURL("images/camera.png")}" />
                    </div>
                    <div>
                        <img title="로그 보기" id="view-console" src="${chrome.runtime.getURL("images/console.png")}" />
                    </div>
                </div>
           </div>
            
           <div class="body-layer">
                <iframe id="console-frame" width="100%" height="100%" frameborder="0" scrolling="yes" style="z-index:1"></iframe>
           </div>
           
       </div>`


    $('body').append(html);

    $('#victory-log-tracer').find('iframe').attr('src', chrome.runtime.getURL('consoleLogPane.html'));
    $('.icon-display-img-div').on('click', function() {
        if (!$('#victory-log-tracer').find('.speed-dial').hasClass('active')) {
            $('#victory-log-tracer').find('.speed-dial').addClass('active');
        } else {
            $('#victory-log-tracer').find('.speed-dial').removeClass('active');
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
        console.log('addErrorLog Error occurred.', e);
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
    $('#victory-log-tracer').find('.body-layer').css({'display':'none'})
}

function captureScreen() {
    chrome.runtime.sendMessage({action: "capture", nextAction: 'copyToClipboard'}, function(response) {});
}

function viewConsole() {
    $('#victory-log-tracer').find('.body-layer').css({'display':'block'})
}

function uploadLogToDropbox() {
    console.log('_xhrErrors', _xhrErrors);

    chrome.runtime.sendMessage({action: "capture", nextAction: 'uploadToDropbox'}, function(response) {});
}

function processUploadLogToDropbox(imageDataUrl) {
    const folder = '/VictoryLogCollector/' + getCurrDate();
    const filename = getCurrDateFormat();
    const logUploadPath = folder + '/' + filename + '.log';

    const fileContent = JSON.stringify(_xhrErrors);
    uploadFileToDropbox(logUploadPath, fileContent, function() {
        console.log(logUploadPath + ' uploaded.');
    });

    const imageUploadPath = folder + '/' + filename + '.png';
    const imgFile = dataURLtoFile(imageDataUrl, filename + '.png');
    uploadFileToDropbox(imageUploadPath, imgFile, function() {
        console.log(imageUploadPath + ' uploaded.');

        alert('Dropbox에 업로드 되었습니다. (' + logUploadPath + ', ' +  imageUploadPath + ')');
    });
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
        console.log('e.data.nextAction', e.data.nextAction);

        if (e.data.nextAction === 'uploadToDropbox') {
            processUploadLogToDropbox(e.data.image);
        } else {
            //console.log(e.data.image)
            copyToClipboard(e, e.data.image, function() {
                console.log('copied to clipboard.');
                alert('화면이 클립보드에 복사되었습니다.')
            });
        }
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



