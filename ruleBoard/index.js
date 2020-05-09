const express = require('express')
var https = require('http');
const fs = require('fs');
const bodyParser = require("body-parser")
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
const mysql = require('mysql');

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


app.get('/query', (req, res) => {
    console.log(req.body)
    con.query("SELECT * FROM feed_vals WHERE deviceID = ? and user = ? and name = ?", [req.body.device, req.body.user, req.body.feeds[1]], (err, resp) => {
        console.log(resp)
    })
})

app.listen(3003, () => console.log("Server running : 3003"))