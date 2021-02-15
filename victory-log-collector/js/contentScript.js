$(() => {
    loadIcon();

    /*setTimeout(function() {
        for (let i=0; i<10; i++)
            sample();
    }, 500);

    setInterval(function() {
        sample();
    }, 1000);*/

    addDraggableEvent(
        document.getElementById("victory-log-tracer"),
        document.getElementById("drag-layer-img")
    );

    $('#capture-screen').on('click', (e) => {
        captureScreen(e);
    });

    $('#record-screen').on('click', (e) => {
        recordScreen(e);
    });

    $('#view-console').on('click', (e) => {
        viewConsole(e);
    });

    $('#upload-dropbox').on('click', (e) => {
        uploadLogToDropbox(e);
    });

    chrome.storage.sync.get('username', function(items) {
       _username = items['username'];
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

injectScript('js/xhrErrorHook.js');
injectScript('js/javascriptErrorHook.js');
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
                        <img title="화면 녹화하기" id="record-screen" src="${chrome.runtime.getURL("images/record.png")}" />
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
           
           <div class="camera-flash"></div>
       </div>`;


    $('body').append(html);

    $('#victory-log-tracer').find('iframe').attr('src', chrome.runtime.getURL('consoleLogPane.html'));
    $('.icon-display-img-div').on('click', () => {
        if (!$('#victory-log-tracer').find('.speed-dial').hasClass('active')) {
            $('#victory-log-tracer').find('.speed-dial').addClass('active');
        } else {
            $('#victory-log-tracer').find('.speed-dial').removeClass('active');
        }
    });

    chrome.storage.sync.get('useFlag', (items) => {
        if (!items['useFlag'] || items['useFlag'] == 'Y') {
            showLogTracer(true);
        } else {
            showLogTracer(false);
        }
    });
}

function showLogTracer(flag) {
    if (flag) {
        $('#victory-log-tracer').css({'display': 'block'});
    } else {
        $('#victory-log-tracer').css({'display': 'none'});
    }

}

const maxErrorLogsCount = 300;
let _errorLogs = [];
let _username = '';

function addErrorLog(type, json, plusBadgeCountFlag) {
    _errorLogs.unshift(json);
    if (_errorLogs.length > maxErrorLogsCount) {
        _errorLogs.length = maxErrorLogsCount;
    }

    try {
        if (json) {
            if (plusBadgeCountFlag) {
                addBadgeCount() ;
            }

            chrome.runtime.sendMessage({'cmd': 'sendLog', 'type': type, 'data': json});
        }
    } catch (e) {
        console.log('addErrorLog Error occurred.', e);
    }
}

function addBadgeCount() {
    $('#victory-log-icon').find('.badge-num').text(_errorLogs.length);
    $('#victory-log-icon').find('.badge-num').css({'display':'flex'});
}

function clearConsoleLog() {
    _errorLogs = [];
    $('#victory-log-icon').find('.badge-num').text('');
    $('#victory-log-icon').find('.badge-num').css({'display':'none'});
}

function closeConsolePane() {
    $('#victory-log-tracer').find('.body-layer').css({'display':'none'})
}

function copyConsoleLog() {
    copyToClipboard(JSON.stringify(_errorLogs), () => {
        console.log('copied to clipboard.');
        showNotification('로그가 클립보드에 복사되었습니다.');
    });
}

function captureScreen(e) {
    chrome.runtime.sendMessage({action: "capture", nextAction: 'copyImageToClipboard'}, (response) => {});
}

function recordScreen(e) {
    startRecording();
}

function viewConsole() {
    if ($('#victory-log-tracer').find('.body-layer').is(':visible')) {
        $('#victory-log-tracer').find('.body-layer').css({'display':'none'})
    } else {
        $('#victory-log-tracer').find('.body-layer').css({'display':'block'})
    }

}

function uploadLogToDropbox() {
    showNotification('Dropbox에 파일 업로드 중...');
    chrome.runtime.sendMessage({action: "capture", nextAction: 'uploadToDropbox'}, (response) => {});
}

function processUploadLogToDropbox(imageDataUrl) {
    let usernamePath = '_NONAME';
    if (_username) {
        usernamePath = _username;
    }

    const folder = `/VictoryLogCollector/${window.location.hostname}/${getCurrDate()}/${usernamePath}` ;
    const filename = getCurrDateFormat();
    const logUploadPath = `${folder}/${filename}.log`;

    // log file
    const logFileContent = JSON.stringify(_errorLogs);
    uploadFileToDropbox(logUploadPath, logFileContent, function() {
        console.log(logUploadPath + ' uploaded.');
    });

    // local storage
    let localStorageContent = '';
    for (let i = 0; i < localStorage.length; i++)   {
        if (!(localStorage.key(i).startsWith('CUSTOMER_') || localStorage.key(i).endsWith('Info')))
            continue;
        localStorageContent += localStorage.key(i) + "=" + localStorage.getItem(localStorage.key(i)) + "\n\n";
    }

    if (localStorageContent != '') {
        const localStorageUploadPath = `${folder}/${filename}.storage.txt`;
        uploadFileToDropbox(localStorageUploadPath, localStorageContent, function() {
            console.log(logUploadPath + ' uploaded.');
        });
    }

    // image file
    const imageUploadPath = `${folder}/${filename}.png`;
    const imgFile = dataURLtoFile(imageDataUrl, filename + '.png');
    uploadFileToDropbox(imageUploadPath, imgFile, function() {
        console.log(imageUploadPath + ' uploaded.');
        showNotification('Dropbox에 파일이 업로드 되었습니다. <br/>' + folder);
    });
}

window.addEventListener('message', (e) => {
    if (e.data && e.data.eventType) {
        addErrorLog('websocket', e.data, false);
    } else {
        switch (e.data.action) {
            case 'close-console-pane':
                closeConsolePane();
                break;
            case 'copy-console-log':
                copyConsoleLog();
                break;
            case 'clear-console-log':
                clearConsoleLog();
                break;
            case 'capture-screen':
                captureScreen();
                break;
            case 'captured':
                animateCameraFlash();

                if (e.data.nextAction == 'uploadToDropbox') {
                    processUploadLogToDropbox(e.data.image);
                } else {
                    copyImageToClipboard(e.data.image, function() {
                        console.log('copied to clipboard.');
                        showNotification('화면이 클립보드에 복사되었습니다.');
                    });
                }
                break;
            case 'change-useflag':
                if (e.data.value === 'Y') {
                    showLogTracer(true);
                } else if (e.data.value === 'N') {
                    showLogTracer(false);
                }
                break;
            default:
                console.log('undefined message received', e.data);
        }
    }
});

document.addEventListener('jsErrorEvent', (e) => {
    addErrorLog('js', e.detail, true);
});

document.addEventListener('xhrErrorEvent', (e) => {
    addErrorLog('xhr', e.detail, true);
});

chrome.runtime.onMessage.addListener((request, sender) => {
    switch (request.action) {
        case 'captured':
        case 'change-useflag':
            window.parent.postMessage(request, '*');
            break;
        default:
            console.error('[contentScript] undefined action', request.action);
    }
});


