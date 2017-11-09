let video = document.getElementById("video");
let img = document.getElementById("photo");
let captured = document.getElementsByClassName("captured");
let labels = document.getElementById("labels");

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

function sendToLabelDetection() {
    const http = new XMLHttpRequest();
    const url = "labels";
    snap().then((blob) => {
        http.open("POST", url, true);
        http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        http.onreadystatechange = () => {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                labels.innerHTML = prepareText(JSON.parse(http.responseText));
            }
        }
        const formData = new FormData();
        formData.append("uploads", blob);
        http.send(formData);
    });
}

function prepareText(labels) {
    let formattedText = '';
    labels.forEach((item)=>{
        formattedText += "<li>description: " + item.description +  " - score: "+ item.score + "</li>";
    });
    console.log(formattedText);
    return "<ul>"+formattedText+"</ul>";
}
