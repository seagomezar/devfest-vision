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

function upload() {
    const http = new XMLHttpRequest();
    const url = "upload";
    snap().then((blob) => {
        http.open("POST", url, true);
        http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        http.onreadystatechange = (data) => {
            //Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                console.log(http.response);
            }
        }
        const formData = new FormData();
        formData.append("uploads", blob);
        http.send(formData);
    });
}
