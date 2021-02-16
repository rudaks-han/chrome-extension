const start = document.getElementById("btnStart");
const stop = document.getElementById("btnStop");
const download = document.getElementById("btnDownload");
const video = document.querySelector("video");
const recordImg = document.querySelector("#record-img");
var canvas = document.getElementById('record-canvas');
var context = canvas.getContext('2d');

let recorder, stream;

let chunks = [];
async function startRecording() {

    try {
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: {mediaSource: "screen"}
        });
    } catch(e) {
        console.error(e);
        alert('[권한오류] ' + e);
        // 보안 및 개인 정보 보호 > 개인 정보 보호 > 화면 기록 > 크롬을 허용으로 설정
    }

    recorder = new MediaRecorder(stream);

    chunks = [];
    recorder.ondataavailable = e => {
        console.log('ondataavailable, state = ' + recorder.state);
        chunks.push(e.data);
    }
    recorder.onstart = e => {
        console.log('Started, state = ' + recorder.state);
        if (chunks.length) {
            const completeBlob = new Blob(chunks, { type: 'video/x-matroska;codecs=avc1' });
            //video.src = URL.createObjectURL(completeBlob);
        }
    };

    function blobToDataURL(blob, callback) {
        var a = new FileReader();
        a.onload = function(e) {callback(e.target.result);}
        a.readAsDataURL(blob);
    }

    recorder.onstop = e => {
        console.log('onStop, state = ' + recorder.state);
        const completeBlob = new Blob(chunks, { type: chunks[0].type });
        video.src = URL.createObjectURL(completeBlob);


    };

    recorder.start();
}

video.addEventListener('play', function() {
    draw( this, context, 1024, 768 );
}, false );

function draw( video, context, width, height ) {
    var image, data, i, r, g, b, brightness;

    context.drawImage( video, 0, 0, width, height );

    image = context.getImageData( 0, 0, width, height );
    data = image.data;

    for( i = 0 ; i < data.length ; i += 4 ) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];
        brightness = ( r + g + b ) / 3;

        data[i] = data[i + 1] = data[i + 2] = brightness;
    }

    image.data = data;

    context.putImageData( image, 0, 0 );

    setTimeout( draw, 10, video, context, width, height );
}


start.addEventListener("click", () => {
    start.setAttribute("disabled", true);
    stop.removeAttribute("disabled");
    download.setAttribute("disabled", true);
    video.src = '';

    startRecording();
});

stop.addEventListener("click", () => {
    stop.setAttribute("disabled", true);
    start.removeAttribute("disabled");
    download.removeAttribute("disabled");

    recorder.stop();
    stream.getVideoTracks()[0].stop();
});

download.addEventListener("click", () => {
    var blob = new Blob(chunks, {
        type: 'video/webm'
        //type: 'image/gif'
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.id = 'for-download';
    a.style = 'display: none';
    a.href = url;
    a.download = 'test.webm';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
});

