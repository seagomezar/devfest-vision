const express = require('express');

const app = express();

/* serves main page */
app.get("/", function (req, res) {
    res.sendfile('index.html')
});

/* serves all the static files */
app.get(/^(.+)$/, function (req, res) {
    console.log('static file request : ' + req.params);
    res.sendfile(__dirname + req.params[0]);
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});

// Setting up multer to upload images
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.jpg')//Appending.jpg
    }
});

const upload = multer({ storage: storage })

app.post("/upload", upload.single('uploads'), 
    (req, res) => {
        const currentFile = req.file.path;
        console.log("Image path: " + req.file.path);
        res.send("Ok");
    }
);

const vision = require('@google-cloud/vision')({
    projectId: 'vision-poc-180601',
    keyFilename: './cloud-credentials.json'
});

app.post("/labels", upload.single('uploads'), function (req, res) {
    const currentFile = req.file.path;
    const request = {
        source: {
            filename: currentFile
        }
    };
    vision.labelDetection(request)
        .then((results) => {
            const labels = results[0].labelAnnotations;
            console.log('Labels:');
            labels.forEach((label) => console.log(label.description));
            res.send(labels);
        })
        .catch((err) => {
            console.error('ERROR:', err);
            res.send("BAD");
        });
});

app.post("/faces", upload.single('uploads'), 
    (req, res) => {
        const currentFile = req.file.path;
        vision.faceDetection({ source: { filename: currentFile } })
            .then((results) => {
                const faces = results[0].faceAnnotations;
                res.send(faces);
            })
            .catch((err) => {
                console.error('ERROR:', err);
                res.send("BAD");
            });
    }
);

