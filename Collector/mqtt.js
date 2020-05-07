const dataCamp = require('../Data-Camp/dataCamp').dataCamp
var mosca = require('mosca');
var mysql = require('mysql');
var fs = require('fs')

const axios = require('axios')

var con = mysql.createConnection({
    host: "localhost",
    user: "divyanshg21",
    password: "potty_khale",
    database: "fila_iot"
});


var settings = {
    port: 1883
}

const io = require("socket.io-client");
const sockClient = io.connect("https://192.168.31.249:3000", {
    secure: true,
    rejectUnauthorized: false
});

var server = new mosca.Server(settings);
var users = []
var authenticate = function (client, username, passwd, callback) {
    //var is_available = dataCamp.DMS_SEARCH_DEVICE(username)  
    if(typeof username == 'undefined') return

    con.query("SELECT * FROM devices WHERE deviceID = ?", [username], function (err, result, fields) {
        if (err) throw err;

        axios.post('http://192.168.31.249:6543/authority/verify', {
            authorization: passwd
        }).then(response => {
            console.log(response)
        })

        var authorized = ''
        //var authorized = (username === result[0].deviceID || username == "MASTER@SERVER@WEB_DASH_HOST");
        //if (authorized) client.users = username
        callback(null, authorized);
    });
}

var authorizePublish = function (client, topic, payload, callback) {

    callback(null, client.user == topic.split('/')[0]);
}

var authorizeSubscribe = function (client, topic, callback) {
    callback(null, client.user == topic.split('/')[0]);
}

server.on('clientConnected', function (client) {
    con.query('update devices set status = "IDLE" where cINST = ?', [client.id], (err, restu) => {
        if (err) throw err;
        con.query('select * from devices where cINST = ?', [client.id], (err, res) => {
            if (err) throw err;
            if (res.length == 0) return
            sockClient.emit('devStat', res[0].deviceID, "IDLE")
        })
    })
});

server.on('ready', function () {
    console.log("ready");
    con.connect()
    sockClient.emit("JoinTheMess", "MQTT@COLLECTOR@MASTER")
    server.authenticate = authenticate;
    //server.authorizePublish = authorizePublish;
    //server.authorizeSubscribe = authorizeSubscribe;
    //server.on('')
});

server.on('published', (packet) => {
    var message = packet.payload.toString()
    //console.log(message)
    var topic = packet.topic.split("/")
    if (topic[2] != "NON") {

        if (topic[1] == '$__VERSION') {
            sockClient.emit("DEV_VERSION", {
                version: message,
                device: topic[0],
                user: topic[2]
            })
        } else if (topic[1] == "FSYS") {
            sockClient.emit('publish', {
                user: topic[2],
                deviceId: topic[0],
                feed: topic[1],
                value: message,
                time: new Date().toLocaleTimeString()
            })
        } else {
            con.query('update devices set status = "ONLINE" where deviceID = ?', [topic[0]], (err, res) => {
                if (err) throw err;
                sockClient.emit('devStat', topic[0], "ONLINE")
            })

            sockClient.emit('publish', {
                user: topic[2],
                deviceId: topic[0],
                feed: topic[1],
                value: message,
                time: new Date().toLocaleTimeString()
            })
        }

        //dataCamp.updateFeed('iub54i6bibu64', 'SkNCX1RSVUNLXzAxYWFk', 'retg54', message)
    } else {
        return
    }
});

server.on('clientDisconnecting', function (client) {
    console.log(client.id)
})
server.on("clientDisconnected", function (client) {
    con.query('update devices set status = "OFFLINE" where deviceID = ?', [client.id], (err, res) => {
        if (err) throw err;
        sockClient.emit('devStat', client.id, "OFFLINE")
    })
});