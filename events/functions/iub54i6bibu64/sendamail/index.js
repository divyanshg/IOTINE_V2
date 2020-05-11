'use strict'


var nodemailer = require('nodemailer');

const io = require("socket.io-client");
const sockClient = io.connect("https://192.168.31.249:3000", {
    secure: true,
    rejectUnauthorized: false
});
var stateCheck = 0;

exports.handler = async (event) => {

    var payload = parseInt(event.value);
    var mtime = event.timestamp;
    if (payload >= 90 && stateCheck == 0) {
        stateCheck = 1;
        await sendMail(payload, mtime)

        sockClient.emit('publish', {
            user: event.user,
            deviceId: 'gUvSTHbQnMuUWI6HHqwiDBvdp6PKbYU4',
            feed: 'ESP_INT_LED',
            value: "ON",
            time: new Date().toLocaleTimeString()
        })

    } else if (payload <= 10) {
        stateCheck = 0;
    }else{
        turnOffCooler(event)
    }
}

function sendMail(payload, mtime) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'iotine.alert@gmail.com',
            pass: 'div21902'
        }
    });

    var mailOptions = {
        from: 'iotine.alert@gmail.com',
        to: 'divyanshg809@gmail.com',
        subject: 'Core temperature was high',
        html: `Core temperature reached <b style="color:red">${payload}</b> on <b style="color:green;">${mtime}</b>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return
        } else {
            return true
        }
    });

}

function turnOffCooler() {
    sockClient.emit('publish', {
        user: event.user,
        deviceId: 'gUvSTHbQnMuUWI6HHqwiDBvdp6PKbYU4',
        feed: 'ESP_INT_LED',
        value: "OFF",
        time: new Date().toLocaleTimeString()
    })
}