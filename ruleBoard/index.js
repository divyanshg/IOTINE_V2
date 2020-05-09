var cors = require('cors')
const app = require('express')()
const https = require('https');
const mysql = require('mysql');
const fs = require('fs');
const bodyParser = require("body-parser")

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

const port = process.env.PORT || 3003;

var con = mysql.createConnection({
    host: "localhost",
    user: "divyanshg21",
    password: "potty_khale",
    database: "fila_iot"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get("/query", (req, res) => {
    res.json({
        "msg": "test success"
    })
})


var server = https.createServer(options, app).listen(3003, function () {
    console.log('listening on *:3000');
});