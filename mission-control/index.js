var cors = require('cors')
var app = require('express')();
const fs = require('fs');
const crypto = require('crypto');
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
    var mystr = cipher.update(text, 'utf8', 'hex')
    mystr += cipher.final('hex');
    return mystr;
}

function decrypt(encrypted) {
    var mystr = decipher.update(text, 'hex', 'utf8')
    mystr += decipher.final('utf8');

    return mystr;
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
                        con.query('select unit from feed_vals where user_id = ? and deviceID = ? and name =?', [msg.user, msg.deviceId, msg.feed], (err, unit) => {
                            if (err) return err;
                            con.query('UPDATE feed_vals SET value =? WHERE user_id=? AND deviceID=? AND name=?', [msg.value, msg.user, msg.deviceId, msg.feed], (err, res) => {
                                if (err) return err
                                io.to(msg.user).emit('subscribe', msg.feed, msg, unit)
                                client.publish(msg.deviceId + "/" + msg.feed + "/NON", msg.value)

                                console.log(encrypt(msg.value)+"\n")
                                console.log(decrypt(msg.value));
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