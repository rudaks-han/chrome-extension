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

function copyToClipboard(e, base64String, onSuccess) {
    fetch(base64String)
        .then(res => res.blob())
        .then(blob =>  {
            let data = [new ClipboardItem({ ['image/png']: blob })];
            navigator.clipboard.write(data)
                .then(() => onSuccess()
                    , (err) => console.error('error', err));
        });
}

function addDraggableEvent(moveElement, dragElement) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
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
const DROPBOX_ACCESS_TOKEN = 'sl.ArLcC72V6f2GgMd6PkDIciGMMthSrmZDj-Y2Kx_LbMe87yTDpzpRUaqSXHoTG5aFV-CsIpc5tgUuV7VJ9-UlNEoyHzis6n3SY-172dSY0SwUfKyoj0a646Bc7_cP9GpuDW8_G_g';

function uploadFileToDropbox(filePath, file, successCallback) {
    $.ajax({
        url: 'https://content.dropboxapi.com/2/files/upload',
        type: 'post',
        data: file,
        processData: false,
        contentType: 'application/octet-stream',
        headers: {
            "Authorization": "Bearer " + DROPBOX_ACCESS_TOKEN,
            "Dropbox-API-Arg": '{"path": "' + filePath + '", "mode": "add","autorename": true,"mute": true}'
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