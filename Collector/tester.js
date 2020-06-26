
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "divyanshg21",
    password: "div21902",
    database: "fila_iot"
});

con.connect(function (err) {
    if (err) return err;
    console.log("Connected!");
    con.query('SELECT * FROM devices WHERE cINST = ?', ["_wlPFr8mNWRFZcUgbxbK08Oh79uCBcuoc"], (err, res) => {
        if (err) throw err;
        if (res.length == 0) return
        console.log("Here2")
    })
});