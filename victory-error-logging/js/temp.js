
var isResizing = false;
var lastDownX = 0;

function resizable() {

    var container = $('#iframe-console-log'),
        //top = $('#iframe-console-log > .header-layer'),
        bodyLayer = $('#iframe-console-log').find('.body-layer'),
        handle = $('#iframe-console-log').find('.drag-layer');

    handle.on('mousedown', function (e) {
        isResizing = true;
        lastDownX = e.clientY;
        console.log('down')

    });

    $(document).on('mousemove', function (e) {
        if (!isResizing)
            return;

        container.css('top', e.clientY);
        container.css('height', $(window).height() - e.clientY);
    }).on('mouseup', function (e) {
        isResizing = false;
        console.log('up')
    });
};




//dragElement(document.getElementById("victory-log-icon"));
//resizable();

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    // 이동 목적지
    if (document.getElementById(elmnt.id + "header")) {
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // 시작지점 마우스좌표 얻기
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // 이동지점 마우스좌표 얻기
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // 이동지점 커서좌표 계산
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // 요소의 새 위치 설정
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* 마우스버튼 풀렸을 때, 이동 멈춤 */
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

