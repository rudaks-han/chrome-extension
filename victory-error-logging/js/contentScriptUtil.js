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
    const image = new Image();
    image.onload = function() {

        var canvasId = 'for-clipboard-copy-canvas';

        $('<canvas>').attr({
            id: canvasId
        }).css({
            width: image.width,
            height: image.height
        }).appendTo('body');

        const canvas = $('#' + canvasId).get(0);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(image, 0, 0);

        copyCanvasContentsToClipboard(canvas, onSuccess, function(err) {
            console.error('error', err);
            $('#' + canvasId).remove();
        });
    };

    image.src = base64String;
}

function copyCanvasContentsToClipboard(canvas, onDone, onError) {
    canvas.toBlob(function (blob) {
        let data = [new ClipboardItem({ ['image/png']: blob })];

        navigator.clipboard.write(data).then(function () {
            onDone();
        }, function (err) {
            onError(err);
        })
    });
}

function addDraggableEvent(el) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(el.id + "header")) {
        document.getElementById(el.id + "header").onmousedown = dragMouseDown;
    } else {
        el.onmousedown = dragMouseDown;
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
        el.style.top = (el.offsetTop - pos2) + "px";
        //el.style.left = (el.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}