function injectScript(file) {
    const script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", chrome.extension.getURL(file));
    document.documentElement.appendChild(script);
    document.documentElement.removeChild(script);
}

function injectCss(file) {
    const css = document.createElement('link');
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("href", chrome.extension.getURL(file));
    document.documentElement.appendChild(css);
    document.documentElement.removeChild(css);
}

function copyImageToClipboard(base64String, onSuccess) {
    fetch(base64String)
        .then(res => res.blob())
        .then(blob =>  {
            let data = [new ClipboardItem({ ['image/png']: blob })];
            navigator.clipboard.write(data)
                .then(() => onSuccess()
                    , (err) => console.error('error', err));
        });
}

function copyToClipboard(text, onSuccess) {
    var $tmpDiv = $('<div style="position:absolute;top:1000px;left:1000px;">'+text.replace(/</g,"&lt;").replace(/>/g,"&gt;")+'</div>').appendTo("body")
    var range = document.createRange();
    var selection = null;

    range.selectNodeContents($tmpDiv.get(0));
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    if (document.execCommand("copy", false, null)) {
        onSuccess();
        $tmpDiv.remove();
    }
}

function addDraggableEvent(moveElement, dragElement) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (dragElement) {
        dragElement.onmousedown = dragMouseDown;
    } else {
        moveElement.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        moveElement.style.top = (moveElement.offsetTop - pos2) + "px";
        //el.style.left = (el.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

const dataURLtoFile = (dataurl, fileName) => {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, {type:mime});
}

// devsum.spectra@gmail.com
const DROPBOX_ACCESS_TOKEN = 'WFgpGqCWZkwAAAAAAAAAAVr5C0iMxt7gfJOQlc-TiA4cZKTGcIUm3SbEdwj7iph6';

var charsToEncode = /[\u007f-\uffff]/g;

function http_header_safe_json(v) {
    return JSON.stringify(v).replace(charsToEncode,
        function (c) {
            return '\\u' + ('000' + c.charCodeAt(0).toString(16)).slice(-4);
        }
    );
}


function uploadFileToDropbox(filePath, file, successCallback) {
    var params = {
        path:filePath,
        "mode": "add",
        "autorename": true,
        "mute": true
    };

    $.ajax({
        url: 'https://content.dropboxapi.com/2/files/upload',
        type: 'post',
        data: file,
        processData: false,
        contentType: 'application/octet-stream',
        headers: {
            "Authorization": "Bearer " + DROPBOX_ACCESS_TOKEN,
           // "Dropbox-API-Arg": '{"path": "' + filePath + '", "mode": "add","autorename": true,"mute": true}'
            'Dropbox-API-Arg': http_header_safe_json(params)
        },
        success: function (data) {
            successCallback(data);
        },
        error: function (data) {
            console.error(data);
        }
    });
}

function getCurrDate() {
    const date = new Date();
    return date.getFullYear() + makeTwoLength(date.getMonth()+1) + makeTwoLength(date.getDate());
}

function getCurrDateFormat() {
    const date = new Date();
    return date.getFullYear() + '' + makeTwoLength(date.getMonth()+1) + '' + makeTwoLength(date.getDate()) + '_' + makeTwoLength(date.getHours()) + '' + makeTwoLength(date.getMinutes()) + '' + makeTwoLength(date.getSeconds());
}

function makeTwoLength(str) {
    if (String(str).length == 1) {
        return '0' + str;
    }
    return str;
}

function animateCameraFlash() {
    $('.camera-flash')
        .show()  //show the hidden div
        .animate({opacity: 0.5}, 300)
        .fadeOut(300)
        .css({'opacity': 1});
}

function showNotification(message) {
    if ($('#victory-notification').length > 0) {
        $('#victory-notification').remove();
    }
    $('<div id="victory-notification"><span class="noti-message">' + message + '</span></div>').appendTo('body');

    $('#victory-notification').fadeIn().delay(3000).fadeOut();

}