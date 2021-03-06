var http = require('https');
const express = require('express');
var app = express();
var formidable = require('formidable');
var fs = require('fs');
const bodyParser = require('body-parser');
var cors = require('cors')

const options = {
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt'),
    ca:[fs.readFileSync('./ca_bundle.crt')]
};

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors())

app.post('/certificateUpload/:device', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        console.log(files)
        console.log(files.length)
        if (!fs.existsSync(`/var/www/IOTINE/IOTINE_V2/Collector/certificates/${req.params.device}/`)) {
            fs.mkdirSync(`/var/www/IOTINE/IOTINE_V2/Collector/certificates/${req.params.device}/`);
        }

        var oldpath = files.filetoupload.path;
        var newpath = `/var/www/IOTINE/IOTINE_V2/Collector/certificates/${req.params.device}/${files.filetoupload.name}`;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.write('File uploaded and moved!');
            res.end();
        });
    });
})



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

var port = 3005;

http.createServer(options, app).listen(port, () => console.log("Server running on : " + port));