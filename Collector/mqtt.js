const dataCamp = require('../Data-Camp/dataCamp').dataCamp
var mosca = require('mosca');
var mysql = require('mysql');
var fs = require('fs')

var jwtDecode = require('jwt-decode');

const axios = require('axios')

var con = mysql.createConnection({
    host: "103.50.151.90",
    user: "divyanshg21",
    password: "potty_khale",
    database: "fila_iot"
});


var settings = {
    port: 1883
}

const io = require("socket.io-client");
const sockClient = io.connect("https://iotine.ddns.net:3000", {
    secure: true,
    rejectUnauthorized: false
});

var server = new mosca.Server(settings);
var users = []
var authenticate = function (client, username, passwd, callback) {
    // DEVICE IP client.connection.stream.remoteAddress
    //var is_available = dataCamp.DMS_SEARCH_DEVICE(username)  
    console.log(client)
    if (typeof username == 'undefined' || username == 'MASTER@SERVER@WEB_DASH_HOST') return callback(null, true)
    con.query("SELECT * FROM devices WHERE deviceID = ?", [username], function (err, result, fields) {
        if (err) throw err;

        axios.post('http://103.50.151.90:6543/authority/verify/' + passwd + "/" + username).then(response => {
            if (response.data.status == 200) {
                var authorized = true
                callback(null, authorized);
            } else {
                var authorized = false;
                callback(null, authorized)
            }

        }).catch(err => {
            return err
        })

    });

}

var authorizePublish = function (client, topic, payload, callback) {

    callback(null, client.user == topic.split('/')[0]);
}

var authorizeSubscribe = function (client, topic, callback) {
    callback(null, client.user == topic.split('/')[0]);
}

server.on('clientConnected', function (client) {
    con.query('update devices set status = "IDLE", sourceIp = ? where cINST = ?', [String(client.connection.stream.remoteAddress), client.id], (err, restu) => {
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
    if (packet.topic.split('/')[0] != '$SYS') {

        var content;

        try {
            content = jwtDecode(packet.topic);
            if(content.exp == null || typeof content.exp == 'undefined' || content.exp == '') return
        } catch (e) {
            return
        }


        jwtTopic = packet.topic

        var device = content.topic.split('/')[0];

        axios.post('https://103.50.151.90:6543/authority/verify/' + jwtTopic + "/" + device).then(response => {

            if (response.data.status != 200) return

            var message = content.value.split("/")[0].toString()
            var topic = content.topic.split("/")

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
                        unit:content.value.split("/")[1].toString(),
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
                        unit:content.value.split("/")[1].toString(),
                        time: new Date().toLocaleTimeString()
                    })
                }

                //dataCamp.updateFeed('iub54i6bibu64', 'SkNCX1RSVUNLXzAxYWFk', 'retg54', message)

            } else {
                return
            }

        }).catch(err => {
            return err
        })

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