var http = require('https');
const express = require('express');
var app = express();
var formidable = require('formidable');
var fs = require('fs');
var cors = require('cors')

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
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
        var oldpath = files.filetoupload.path;
        var newpath = `/var/www/html/IOTINE_V2/devAPI/sampleDevice/${files.filetoupload.name}`;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.write('File uploaded and moved!');
            console.log(files)
            res.end();
        });
    });
})

app.get('/', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
})

var port = 3005;

http.createServer(options, app).listen(port, () => console.log("Server running on : " + port));