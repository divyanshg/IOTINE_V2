var cors = require('cors')
const express = require('express')
const https = require('https');
const mysql = require('mysql');
const bodyParser = require("body-parser")

const app = express()

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
    
})