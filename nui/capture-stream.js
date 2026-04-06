// alles global, kein export/import
let recorder, canvas, mediaStream;

window.captureStream = function({ serverEndpoint, uploadToken, formField }) {
    canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    mediaStream = canvas.captureStream(15); // 15 FPS für Performance

    recorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm; codecs=vp8' });

    recorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
            const formData = new FormData();
            formData.append(formField || 'file', event.data, 'capture.webm');
            try {
                await fetch(`${serverEndpoint}/${uploadToken}`, { method: 'POST', body: formData });
            } catch(e) {
                console.error('Upload failed', e);
            }
        }
    };

    recorder.start(500); // alle 500ms Chunks
    console.log("Stream gestartet");
};

window.stopCaptureStream = function() {
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
    console.log("Stream gestoppt");
};