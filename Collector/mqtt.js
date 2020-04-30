const dataCamp = require('../Data-Camp/dataCamp').dataCamp
var mosca = require('mosca');
var mysql = require('mysql');

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
const sockClient = io.connect("http://192.168.31.249:3000");

var server = new mosca.Server(settings);
var users = []
var authenticate = function (client, username, passwd, callback) {
    //var is_available = dataCamp.DMS_SEARCH_DEVICE(username)  
    con.query("SELECT CONNstr FROM device_management_service WHERE CONNstr = ?", [username], function (err, result, fields) {
        if (err) throw err;
        var authorized = (username === result.CONNstr || username == "MASTER@SERVER@WEB_DASH_HOST");
        console.log(result[0].CONNstr)
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

server.on('ready', function () {
    console.log("ready");
    con.connect()
    sockClient.emit("JoinTheMess", "MQTT@COLLECTOR@MASTER")
    //server.authenticate = authenticate;
    //server.authorizePublish = authorizePublish;
    //server.authorizeSubscribe = authorizeSubscribe;
    //server.on('')
});

server.on('published', (packet) => {
    var message = packet.payload.toString()
    //console.log(message)
    var topic = packet.topic.split("/")
    if (topic[2] != "NON") {
        sockClient.emit('publish', {
            user: topic[2],
            deviceId: topic[0],
            feed: topic[1],
            value: message,
            time: new Date().toLocaleTimeString()
        })
        //dataCamp.updateFeed('iub54i6bibu64', 'SkNCX1RSVUNLXzAxYWFk', 'retg54', message)
    }else if(topic[0] == "$SYS" && topic[1] == "STATUS"){
        console.log(topic[2]+" : IS NOW ONLINE")
    } else {
        return
    }
});