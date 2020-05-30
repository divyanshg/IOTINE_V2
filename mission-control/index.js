require('dotenv').config();

var cors = require('cors')
var app = require('express')();
const fs = require('fs');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://192.168.31.72:27017/";

const options = {
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt'),
    ca: [fs.readFileSync('./ca_bundle.crt')]
};

var http = require('https')

var PORT = process.env.PORT || 3000;

var server = http.createServer(options, app).listen(PORT, function () {
    console.log('Server ready '+PORT);
});

var io = require('socket.io').listen(server);
var mqtt = require('mqtt')
var redis = require("redis");

var dataController_Pub = redis.createClient({
    host : '192.168.31.72',  
    no_ready_check: true,
    auth_pass: "RBOJ9cCNoGCKhlEBwQLHri1g+atWgn4Xn4HwNUbtzoVxAYxkiYBi7aufl4MILv1nxBqR4L6NNzI0X6cE",                                                                                                                                                           
});

var dataController_Sub = redis.createClient({
    host : '192.168.31.72',  
    no_ready_check: true,
    auth_pass: "RBOJ9cCNoGCKhlEBwQLHri1g+atWgn4Xn4HwNUbtzoVxAYxkiYBi7aufl4MILv1nxBqR4L6NNzI0X6cE",                                                                                                                                                           
});

var dataCamp;

MongoClient.connect(url, {
    useUnifiedTopology: true
}, function (err, db) {
    if (err) throw err;
    dataCamp = db.db("fila_iot");
});

app.use(cors())
var secrateKey = "23ibu43b5ib345ubi43ub545234938gbr934gb439b54e98rgbwe3fgbew9"


var client = mqtt.connect('192.168.31.72:1883', {
    username: "MASTER@SERVER@WEB_DASH_HOST"
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html')
})

app.get('/login/:user/:pass', (req, res) => {
    dataCamp.collection("users").find({
        username: req.params.user,
        password: req.params.pass
    }).toArray((err, resp) => {
        if (err) return err;

        if (resp.length == 0) {
            res.json({
                status: 404
            });
            res.end();
            return;
        } else {
            res.json({
                status: 200
            })
            res.end()
        }
    })
})

app.get('/apps/:user', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.get('/dashboard/:user/:appId', function (req, res) {
    dataCamp.collection("apps").find({
        name: req.params.appId,
        user: req.params.user
    }).toArray((err, resp) => {
        if (err) return err;
        if (resp.length == 0) {
            res.sendFile(__dirname + '/404.html');
            return;
        } else {
            res.sendFile(__dirname + '/dashboard.html');
        }
    })
});

app.get('/builder/dashboard/:user/:app', (req, res) => {
    res.sendFile(__dirname + '/builder.html')
});

app.get('/mission', (req, res) => {
    res.sendFile(__dirname + '/mission.js')
});

app.get('/rules/:user/:app', (req, res) => {
    res.sendFile(__dirname + '/rules/index.html')
})

app.get('/rulejs', (req, res) => {
    res.sendFile(__dirname + '/rules/rules.js')
});

app.get('/theme', (req, res) => {
    res.sendFile(__dirname + '/theme.js')
});

app.get('/defend/:user/:app', (req, res) => {
    res.sendFile(__dirname + '/defend/index.html')
})

app.get("/ink", (req, res) => {
    res.sendFile(__dirname + '/ink/index.html')
})

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/404.html');
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

dataController_Sub.on("message", (topic, msg) => {
    if(topic == "publish"){
        handlePublish(JSON.parse(msg))
    }else if(topic == "devStat"){
        handleDevStat()
    }else if(topic == "dev_version"){
        handleDevVersion(JSON.parse(msg))
    }
})

dataController_Sub.subscribe("publish")
//dataController_Sub.subscribe("devStat")
dataController_Sub.subscribe("dev_version")

io.on('connection', function (socket) {
    socket.on("JoinTheMess", (data) => {
        socket.join(data)
    })

    socket.on('publish', function (msg) {
        dataController_Pub.publish("publish", JSON.stringify(msg));
    });

    socket.on('devStat', (device, status) => {
        if (device.split("_")[0] == "mqttjs") {
            return
        } else {
            dataCamp.collection("devices").find({
                "deviceID": device
            }).toArray((err, res) => {
                if (err) return err;
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
        dataController_Pub.publish("dev_version", JSON.stringify(msg));
    })

    socket.on('drawing', (msg) => {
        io.to(msg.classID).emit("drawing", msg)
    })
});

var saveToLake = async (msg) => {
    var vals = [
        [null, msg.user, JSON.stringify(msg)]
    ]
    dataCamp.collection("lake").insertOne(msg, (err, res) => {
        return "OK"
    })
}

var handleDevVersion = (msg) => {
    io.to(msg.user).emit("DEV_VERSION", {
        version: msg.version,
        device: msg.device
    })
    saveToLake(msg)
}

var handleDevStat = () => {
    return
}

var handlePublish = (msg) => {
    if (msg.feed.split("/")[0] != "$SYS") {
        if (msg.feed == "FSYS") {
            io.to(msg.user).emit('FSYS', msg.value, msg.deviceId)
            saveToLake(msg)
        } else {

            dataCamp.collection("feed_vals").find({
                "name": msg.feed,
                "deviceID": msg.deviceId
            }).toArray(function (err, respp) {
                if (err) {
                    return err;
                } else if (respp.length == 0) {
                    if (msg.deviceId == "$SYS") return
                    dataCamp.collection("feed_vals").insertOne({
                        "name": msg.feed,
                        "deviceID": msg.deviceId,
                        "user_id": msg.user,
                        "value": msg.value,
                        "unit": msg.unit
                    }, (err, result) => {
                        if (err) return err;
                    });
                } else {
                    dataCamp.collection("feed_vals").find({
                        "user_id": msg.user,
                        "deviceID": msg.deviceId,
                        "name": msg.feed
                    }).toArray((err, feedInfo) => {
                        if (err) return err;
                        dataCamp.collection("feed_vals").updateOne({
                            "user_id": msg.user,
                            "deviceID": msg.deviceId,
                            "name": msg.feed
                        }, {
                            $set: {
                                "value": msg.value
                            }
                        }, (err, res) => {
                            if (err) return err

                            //Checking and running the events processing
                            /*if (feedInfo[0].events != "[]") {

                                Object.keys(require.cache).forEach(function (key) {
                                      delete require.cache[key]
                                  })
                                  var eventProcessor = require('../events/eventProcessor')
                                  var events = JSON.parse(`${feedInfo[0].events}`)

                                  events.forEach(event => {
                                      msg.timestamp = feedInfo[0].time
                                      eventProcessor.processEvent(`${msg.user}/${event}`, msg).then(async response => {
                                          io.to(msg.user).emit('subscribe', msg.feed, msg, String(feedInfo[0].unit))
                                          client.publish(msg.deviceId + "/" + msg.feed + "/NON", msg.value)
                                          await saveToLake(msg)

                                      }).catch(async (err) => {
                                          io.to(msg.user).emit('subscribe', msg.feed, msg, String(feedInfo[0].unit))
                                          client.publish(msg.deviceId + "/" + msg.feed + "/NON", msg.value)
                                          await saveToLake(msg)
                                      })
                                  })
                            } else {*/
                                io.to(msg.user).emit('subscribe', msg.feed, msg, feedInfo[0].unit)
                                client.publish(msg.deviceId + "/" + msg.feed + "/NON", msg.value)
                                saveToLake(msg)
                            //}
                        })

                        //dataCamp.updateFeed(msg.user, msg.deviceId, msg.feed, msg.value)
                    })
                }

            })
        }
    } else {
        client.publish(msg.deviceId + "/" + msg.feed + "/NON", msg.value)
    }
}