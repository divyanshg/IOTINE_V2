var cors = require('cors')
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mqtt = require('mqtt')

app.use(cors())

const crypto = require('crypto');  
const secret = 'Let this be a Key something more random to make this key super long';  
const hash = crypto.createDecipher('aes192', secret)  

var client = mqtt.connect('mqtt://192.168.31.249:1883', {username: "MASTER@SERVER@WEB_DASH_HOST"})

const dataCamp = require('../Data-Camp/dataCamp').dataCamp

app.get('/:userId/:appId', function (req, res) {
    res.sendFile(__dirname + '/dashboard.html');
});

app.get('/builder/:userId/:app', (req,res) => {
    res.sendFile(__dirname +'/builder.html')
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
    socket.on('publish', function (msg) {
        socket.broadcast.emit('subscribe', msg.feed, msg)
        client.publish(msg.deviceId+"/"+msg.feed+"/NON", msg.value)
        dataCamp.updateFeed(msg.user, msg.deviceId, msg.feed, msg.value)
    });

    socket.on('tester', msg => console.info(msg))

});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
