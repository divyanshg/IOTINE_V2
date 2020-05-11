require('dotenv').config();
var cors = require('cors')
var app = require('express')();
const fs = require('fs');


const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = "2hg34o09j09d23JJ2hg34o09j09d23JJ";
const iv = "2hg34o09j09d23JJ";

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

var http = require('https')

const cipher = crypto.createCipher('aes-128-cbc', 'mypassword');
const decipher = crypto.createDecipher('aes-128-cbc', 'mypassword');

var server = http.createServer(options, app).listen(3000, function () {
    console.log('listening on *:3000');
});

var io = require('socket.io').listen(server);
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

var secrateKey = "23ibu43b5ib345ubi43ub545234938gbr934gb439b54e98rgbwe3fgbew9"

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex')
}

function decrypt(text) {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

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
                saveToLake(msg)
            } else {
                con.query('select * from feed_vals where  name = ? and deviceID = ?', [msg.feed, msg.deviceId], (err, respp) => {
                    if (err) {
                        return err;
                    } else if (respp.length == 0) {
                        if (msg.deviceId == "$SYS") return
                        var feedvalue = [
                            [null, msg.feed, msg.deviceId, msg.user, msg.value, '']
                        ]
                        var sql = "INSERT INTO feed_vals (id, name, deviceID, user_id, value, unit) VALUES ?";
                        con.query(sql, [feedvalue], function (err, result) {
                            if (err) throw err;
                        });
                    } else {
                        con.query('select unit, events, time from feed_vals where user_id = ? and deviceID = ? and name =? limit 1', [msg.user, msg.deviceId, msg.feed], (err, feedInfo) => {
                            if (err) return err;
                            con.query('UPDATE feed_vals SET value =? WHERE user_id=? AND deviceID=? AND name=?', [msg.value, msg.user, msg.deviceId, msg.feed], (err, res) => {
                                if (err) return err

                                //Checking and running the events processing
                                if (feedInfo[0].events != "[]") {

                                    Object.keys(require.cache).forEach(function(key) { delete require.cache[key] })
                                    var eventProcessor = require('../events/eventProcessor')
                                    var events = JSON.parse(feedInfo[0].events)

                                    events.forEach(event => {
                                        msg.timestamp  = feedInfo[0].time
                                        eventProcessor.processEvent(`${msg.user}/${event}`, msg).then(response => {
                                            io.to(msg.user).emit('subscribe', msg.feed, msg, String(feedInfo[0].unit))
                                            client.publish(msg.deviceId + "/" + msg.feed + "/NON", msg.value)

                                            var hw = encrypt(msg.value)
                                            saveToLake(msg)

                                        }).catch(err => {
                                            io.to(msg.user).emit('subscribe', msg.feed, msg, String(feedInfo[0].unit))
                                            client.publish(msg.deviceId + "/" + msg.feed + "/NON", msg.value)

                                            var hw = encrypt(msg.value)
                                            saveToLake(msg)
                                        })
                                    })
                                } else {
                                    io.to(msg.user).emit('subscribe', msg.feed, msg, feedInfo[0].unit)
                                    client.publish(msg.deviceId + "/" + msg.feed + "/NON", msg.value)

                                    var hw = encrypt(msg.value)
                                    saveToLake(msg)
                                }


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
                    saveToLake({
                        "user": res[0].uName,
                        "msg": {
                            "device": device,
                            "status": status
                        }
                    })
                }
            })
        }
    })
    socket.on('DEV_VERSION', (msg) => {
        io.to(msg.user).emit("DEV_VERSION", {
            version: msg.version,
            device: msg.device
        })
        saveToLake(msg)
    })

});

var saveToLake = (msg) => {
    var vals = [
        [null, msg.user, JSON.stringify(msg)]
    ]
    con.query("insert into lake(id, user, msg) values ?", [vals], (err, res) => {
        return "OK"
    })
}