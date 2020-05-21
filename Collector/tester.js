
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
    con.query("SELECT * FROM devices", (err, res) => {
        if(err) throw err;
        console.log(res)
    })
});