let video = document.getElementById("video");
let img = document.getElementById("photo");
let captured = document.getElementsByClassName("captured");

navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
    let mediaStreamTrack = stream.getVideoTracks()[0];
    imageCapture = new ImageCapture(mediaStreamTrack);
});

function snap() {
    return imageCapture.takePhoto()
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            img.src = imageUrl;
            return blob;
        });
}