var mosca = require('mosca');
var fs = require('fs')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://192.168.31.72:27017/";

var jwtDecode = require('jwt-decode');

const axios = require('axios')

var dataCamp;

MongoClient.connect(url, {useUnifiedTopology: true}, function (err, db) {
    if (err) throw err;
    dataCamp = db.db("fila_iot");
});

var settings = {
    port: 1883
}

const io = require("socket.io-client");
const sockClient = io.connect("https://192.168.31.72/", {
    secure: true,
    rejectUnauthorized: false
});


var server = new mosca.Server(settings);
var users = []
var authenticate = function (client, username, passwd, callback) {
    // DEVICE IP client.connection.stream.remoteAddress
    //var is_available = dataCamp.DMS_SEARCH_DEVICE(username)  
    if (typeof username == 'undefined' || username == 'MASTER@SERVER@WEB_DASH_HOST') return callback(null, true)
    dataCamp.collection("devices").find({"deviceID": username}).toArray((err, result) => {
        if (err) throw err;

        axios.post('http://192.168.31.72:6543/authority/verify/' + passwd + "/" + username).then(response => {
            if (response.data.status == 200) {
                var authorized = true
                callback(null, authorized);
            } else if(response.data.status == 403){
                var authorized = false;
                callback(null, authorized)
            }else{
                return
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
    console.log("Connected")
    if (client.id.split("_")[0] == "mqttjs") return
    dataCamp.collection("devices").updateOne({"cINST": client.id}, { $set: {"status": "IDLE", "sourceIp": String(client.connection.stream.remoteAddress)} }, (err, restu) => {
        if (err) throw err;
        dataCamp.collection("devices").find({"cINST": client.id}).toArray((err, res) => {
            if (err) throw err;
            if (res.length == 0) return
            sockClient.emit('devStat', res[0].deviceID, "IDLE")
        })
    })
});

server.on('ready', function () {
    console.log("ready");
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
            if (content.exp == null || typeof content.exp == 'undefined' || content.exp == '') return
        } catch (e) {
            return
        }


        jwtTopic = packet.topic

        var device = content.topic.split('/')[0];

        axios.post('http://192.168.31.72:6543/authority/verify/' + jwtTopic + "/" + device).then(response => {

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
                        unit: content.value.split("/")[1].toString(),
                        time: new Date().toLocaleTimeString()
                    })
                } else {
                    dataCamp.collection("devices").updateOne({"deviceID": topic[0]}, { $set: {"Status": "ONLINE"} }, (err, res) => {
                        if (err) throw err;
                        sockClient.emit('devStat', topic[0], "ONLINE")
                    })

                    sockClient.emit('publish', {
                        user: topic[2],
                        deviceId: topic[0],
                        feed: topic[1],
                        value: message,
                        unit: content.value.split("/")[1].toString(),
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
    dataCamp.collection("devices").updateOne({"deviceID": client.id}, { $set:{"status": "OFFLINE"} }, (err, res) => {
        if (err) throw err;
        sockClient.emit('devStat', client.id, "OFFLINE")
    })
});