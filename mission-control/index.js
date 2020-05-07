require('dotenv').config();
var cors = require('cors')
var app = require('express')();
const fs = require('fs');

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgyEPq876zmY+A6kAMqhE1BOzKRV813h8eHXamEQmIQ67Ua1QBt7lL8MeltV7sid3cjRsvw3rCpA9IH46RieembpvD1uSJ50ZODPqFxwgTzaHLSk6uaySkIeaKauE2hjiKsWGXEkPbrgA0SOws5SIpPWb9bUc8mGVxmvmcVlX4rDPVsIlQpMiPUyo14N9qU63Eggax0CsKN0o7shUqIK3mFElsWqAQ57bPRma7qMUk6sUV7gL4y6lgpFQPGItAdRcfvNcqjOwe9Rd+pOUdgQIU2T0lc9myBJTUg+wCSWYrTk7Ab6eAwpaVDNY2brvuvTqVDLPqeKYaxKBOyUNgfSamwIDAQAB";
const iv = "MIIEogIBAAKCAQEAgyEPq876zmY+A6kAMqhE1BOzKRV813h8eHXamEQmIQ67Ua1QBt7lL8MeltV7sid3cjRsvw3rCpA9IH46RieembpvD1uSJ50ZODPqFxwgTzaHLSk6uaySkIeaKauE2hjiKsWGXEkPbrgA0SOws5SIpPWb9bUc8mGVxmvmcVlX4rDPVsIlQpMiPUyo14N9qU63Eggax0CsKN0o7shUqIK3mFElsWqAQ57bPRma7qMUk6sUV7gL4y6lgpFQPGItAdRcfvNcqjOwe9Rd+pOUdgQIU2T0lc9myBJTUg+wCSWYrTk7Ab6eAwpaVDNY2brvuvTqVDLPqeKYaxKBOyUNgfSamwIDAQABAoIBAG0TbEi7NG/KJp2+z9ZTmGVdObPcFuvZYpiFWF8+mQT4jyLi6uW8NaLkSKapUGqiX76VEzxdpH01/FLyDSFcRZaUuVtqDYp8KIVS0c+Fau7ZadpMKHhYr9YfpkIxVaJh/ogbpKdRcs/jqXJOoObQkFW/pIrfrAOG3yKdkKQK8Is00qfOGvUPVPeoevdQOF+5dGIGeE6B3eMhqJD6vq+/3z2T2qttOVGQuyXR817fn1UM3JdX/E1VRl2qBRrwMOZm1Wiw4UaQ8+ASu4PpPqkJQVDIb0W7BaPzQZ1SeylVMc/nBjEl0IDgp+/WQj20pcEVuUZlxt8wrlbK3RvqE/7D9kECgYEA7xSx01OV+8tBbHTw+gJzfxNyRs2v2Juzd4Z0y1dUpBm3fx4hnUkgzHP9NAueHTKvUMsUAwzct5l122hGNTRETGj8o8IaVkIEij39bmQvsUbgHZOYFbD7JNhdErWZq3hXmvOu6o1V5o/E1zXVRxxJgP07ESCmxbyHZS1U+NFaf+ECgYEAjGipMq+WYQqqP1ST1wnCNlbYr/6bvhwU6jFV0MS4qclV/EoOdfQXcqISsJTMhR0bcchOCznWtXmRLiswjRWpNxtSC3DOff13SDeBGBQ+WrFaUVebH3MK47tZ9khfjJPTL0kTS4j4vd3+2uHf9ddilImIlvo9P4DvcZ64P9BEWfsCgYAw1g5Y94r8ixFLITwUJaoH/CXstplD6tInCS0UWDtu5d3otnPxV/2+JbdECVd76V2MaF8nHFp9mnhLoCovNgT5gryQitasZgHdZzo8cXSYhrzC7eI0FBnI9fVVHAlO0F88xKgnO0WfuiBgQZvWUb3l/lQxdHT8kT0q+q6PwNv2oQKBgCam1RT/4xy5q94dMUl8BTuiMqpYI5V084j4pc//p3oN057M4Cg2VpIW7aAwhhCKz7hF1L4gYOu6GG4mM4pTES77VV2S4zUppkF6Dg6L3BJpShykSi6hI7lHJN+4Up1HQFZ+/lHH1fmmd/bXQSjS7u9G4RP2tQ+bNc8IS149veMrAoGANZ2CRNuTaWZhcZRXuqKE6LBLmRhxVTtRZMUEenMzZ56uOTY2/UNK0CMkljK08K99O97VOxv5jhlWM1W/FIqElwwtj3t8+Q40FWU2L20Ct/TPQFR0+4Qej1GXp6IRjaVA1T6dg0BPrr1M9+IDxnw4bpS3IfWdP+OH60SC38GF18Y=";

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

                                var hw = encrypt(msg.value)
                                console.log(hw)
                                console.log(decrypt(hw))
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