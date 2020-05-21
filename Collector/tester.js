
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
    con.query("UPDATE devices SET sourceIp = '192.168.31.249'", (err, res) => {
        if(err) throw err;
        console.log(res)
    })
});