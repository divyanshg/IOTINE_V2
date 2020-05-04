var cors = require('cors')
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mqtt = require('mqtt')
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

app.use(cors())

const crypto = require('crypto');
const secret = 'Let this be a Key something more random to make this key super long';
const hash = crypto.createDecipher('aes192', secret)

var client = mqtt.connect('mqtt://192.168.31.249:1883', {
    username: "MASTER@SERVER@WEB_DASH_HOST"
})

const dataCamp = require('../Data-Camp/dataCamp').dataCamp

app.get('/:userId/:appId', function (req, res) {
    res.sendFile(__dirname + '/dashboard.html');
});

app.get('/builder/:userId/:app', (req, res) => {
    res.sendFile(__dirname + '/builder.html')
});

var rooms = [{
        name: "iub54i6bibu64",
        devices: []
    },
    {
        name: "yeah",
        devices: []
    }
]

io.on('connection', function (socket) {
    socket.on("JoinTheMess", (data) => {
        socket.join(data)
    })
    socket.on('publish', function (msg) {
        if (msg.feed.split("/")[0] != "$SYS") {
            if (msg.feed == "FSYS") {
                io.to(msg.user).emit('FSYS', msg.value, msg.deviceId)
            } else {
                con.query('select * from feed_vals where  name = ? and deviceID = ?', [msg.deviceId, msg.feed], (err, respp) => {
                    if (err) return err;
                    if (respp.length == 0) {
                        console.log("here aa")
                        var feed = [
                            [null, msg.feed, msg.deviceId, msg.user_id, msg.value]
                        ]

                        con.query('insert into feed_vals (id, name, deviceID, user_id, value) values ?', [feed], (err, res) => {
                            if (err) return err;
                            console.log("DONE")
                            return
                        })
                    } else {
                        console.log("here dd")
                        con.query('select unit from feed_vals where user_id = ? and deviceID = ? and name =?', [msg.user, msg.deviceId, msg.feed], (err, unit) => {
                            if (err) return err;
                            con.query('UPDATE feed_vals SET value =? WHERE user_id=? AND deviceID=? AND name=?', [msg.value, msg.user, msg.deviceId, msg.feed], (err, res) => {
                                if (err) return err
                                io.to(msg.user).emit('subscribe', msg.feed, msg, unit)
                                client.publish(msg.deviceId + "/" + msg.feed + "/NON", msg.value)
                            })

                            //dataCamp.updateFeed(msg.user, msg.deviceId, msg.feed, msg.value)
                        })
                    }

                })
            }
        } else {
            client.publish(msg.deviceId + "/" + msg.feed + "/NON", msg.value)
        }
    });

    socket.on('devStat', (device, status) => {
        if (device.split("_")[0] == "mqttjs") {
            return
        } else {
            con.query('select * from devices where deviceID = ?', [device], (err, res) => {
                if (err) throw err;
                if (res.length == 0) {
                    return
                } else {
                    io.to(res[0].uName).emit('devStat', device, status)
                }
            })
        }
    })
    socket.on('DEV_VERSION', (msg) => {
        io.to(msg.user).emit("DEV_VERSION", {
            version: msg.version,
            device: msg.device
        })
    })

});

function createFeed(msg) {

}

http.listen(3000, function () {
    console.log('listening on *:3000');
});