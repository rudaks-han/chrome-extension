const start = document.getElementById("btnStart");
const stop = document.getElementById("btnStop");
const download = document.getElementById("btnDownload");
const video = document.querySelector("video");
let recorder, stream;

let chunks = [];
async function startRecording() {
    stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" }
    }, function(stream) {
        console.log('stream....')
    });
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
            video.src = URL.createObjectURL(completeBlob);
        }

    };
    recorder.onstop = e => {
        console.log('onStop, state = ' + recorder.state);
        const completeBlob = new Blob(chunks, { type: chunks[0].type });
        video.src = URL.createObjectURL(completeBlob);
    };

    recorder.start();

    setInterval(function() {
        console.log('chunks.length', chunks.length)
    }, 1000)
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

/*
function download() {
    var blob = new Blob(recordedChunks, {
        type: 'video/webm'
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'test.webm';
    a.click();
    window.URL.revokeObjectURL(url);
}*/
