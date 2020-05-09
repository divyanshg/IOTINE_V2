const express = require('express')
var https = require('http');
const fs = require('fs');

const app = express();

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
    con.query("SELECT * FROM feed_vals WHERE deviceID = ? and user = ? and name = ?", [req.body.device, req.body.user, req.body.feeds[1]], (err, res) => {
        console.log(resp)
    })
})

app.listen(3003, () => console.log("Server running : 3003"))