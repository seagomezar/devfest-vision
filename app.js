let video = document.getElementById("video");
let img = document.getElementById("photo");
let captured = document.getElementsByClassName("captured");
let labels = document.getElementById("labels");
let faceCounter = document.getElementById("faceCounter");
let continuar = true;

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
    labels.forEach((item) => {
        formattedText += "<li>description: " + item.description + " - score: " + item.score + "</li>";
    });
    console.log(formattedText);
    return "<ul>" + formattedText + "</ul>";
}

function sendToFaceDetection() {
    const http = new XMLHttpRequest();
    const url = "faces";
    snap().then((blob) => {
        http.open("POST", url, true);
        http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        http.onreadystatechange = function (data) {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                const faces = JSON.parse(http.response);
                console.log(faces);
            }
        }
        const formData = new FormData();
        formData.append("uploads", blob);
        http.send(formData);
    });
}

function stopFacesCounter() {
    continuar = false;
}

function facesCounter() {
    const http = new XMLHttpRequest();
    const url = "faces";
    snap().then((blob) => {
        http.open("POST", url, true);
        http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        http.onreadystatechange = (data) => {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                const faces = JSON.parse(http.response);
                faceCounter.innerText = faces.length;
                if (continuar) {
                    facesCounter();
                }
            }
        }
        const formData = new FormData();
        formData.append("uploads", blob);
        http.send(formData);
    });
}

function emotionAnalysis() {
    let sorrowCounter = document.getElementById("sorrowCounter");
    let joyCounter = document.getElementById("joyCounter");
    let angryCounter = document.getElementById("angryCounter");
    let surpriseCounter = document.getElementById("surpriseCounter");

    const http = new XMLHttpRequest();
    const url = "faces";
    let sorrowPeopleCounter = 0;
    let angryPeopleCounter = 0;
    let joyPeopleCounter = 0;
    let surprisePeopleCounter = 0;


    snap().then((blob) => {
        http.open("POST", url, true);
        http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        http.onreadystatechange = (data) => {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                const faces = JSON.parse(http.response);
                faces.forEach(element => {
                    if (element.sorrowLikelihood === 'LIKELY' || element.sorrowLikelihood === 'VERY_LIKELY') {
                        sorrowPeopleCounter++;
                    } else if (element.surpriseLikelihood === 'LIKELY' || element.surpriseLikelihood === 'VERY_LIKELY') {
                        surprisePeopleCounter++;
                    } else if (element.angerLikelihood === 'LIKELY' || element.angerLikelihood === 'VERY_LIKELY') {
                        angryPeopleCounter++;
                    } else if (element.joyLikelihood === 'LIKELY' || element.angerLikelihood === 'VERY_LIKELY') {
                        joyPeopleCounter++;
                    }
                });
                faceCounter.innerText = faces.length;
                sorrowCounter.innerText = sorrowPeopleCounter;
                surpriseCounter.innerText = surprisePeopleCounter;
                angryCounter.innerText = angryPeopleCounter;
                joyCounter.innerText = joyPeopleCounter;
            }
        }
        const formData = new FormData();
        formData.append("uploads", blob);
        http.send(formData);
    });
}


function analizarMeetup() {
    let sorrowCounter = document.getElementById("sorrowCounter");
    let joyCounter = document.getElementById("joyCounter");
    let angryCounter = document.getElementById("angryCounter");
    let surpriseCounter = document.getElementById("surpriseCounter");

    const http = new XMLHttpRequest();
    const url = "analizar-meetup";
    let sorrowPeopleCounter = 0;
    let angryPeopleCounter = 0;
    let joyPeopleCounter = 0;
    let surprisePeopleCounter = 0;


    snap().then((blob) => {
        http.open("POST", url, true);
        http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        http.onreadystatechange = (data) => {//Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                const faces = JSON.parse(http.response);
                faces.forEach(element => {
                    if (element.sorrowLikelihood === 'LIKELY' || element.sorrowLikelihood === 'VERY_LIKELY') {
                        sorrowPeopleCounter++;
                    } else if (element.surpriseLikelihood === 'LIKELY' || element.surpriseLikelihood === 'VERY_LIKELY') {
                        surprisePeopleCounter++;
                    } else if (element.angerLikelihood === 'LIKELY' || element.angerLikelihood === 'VERY_LIKELY') {
                        angryPeopleCounter++;
                    } else if (element.joyLikelihood === 'LIKELY' || element.angerLikelihood === 'VERY_LIKELY') {
                        joyPeopleCounter++;
                    }
                });
                faceCounter.innerText = faces.length;
                sorrowCounter.innerText = sorrowPeopleCounter;
                surpriseCounter.innerText = surprisePeopleCounter;
                angryCounter.innerText = angryPeopleCounter;
                joyCounter.innerText = joyPeopleCounter;
            }

        }
        const formData = new FormData();
        formData.append("uploads", blob);
        http.send(formData);
    });
}
