'use strict'


var nodemailer = require('nodemailer');
const axios = require('axios')
const io = require("socket.io-client");
const sockClient = io.connect("https://iotine.zapto.org", {
    secure: true,
    rejectUnauthorized: false
});
var stateCheck = 0;

exports.handler = async (event) => {

    //axios.get("http://localhost:5000?url="+event).then(resp => {
        //console.log(resp.data)
        /*sockClient.emit('publish', {
            user: event.user,
            deviceId: '_wlPFr8',
            feed: 'sample_Picture',
            value: "http://localhost:5000?url="+event.url,
            unit:"imgproc",
            time: new Date().toLocaleTimeString(),
            from:"event"
        })*/
    //}).catch(err => {
        //console.log(err)
    //})

    //axios.get('http://192.168.31.72:5678/api').then(response => {
        /*sockClient.emit('publish', {
            user: event.user,
            deviceId: '_wlPFr8',
            feed: 'CORE_TEMP',
            value: String(event.value),
            time: new Date().toLocaleTimeString(),
            from:"evente"
        })*/
        //console.log(response.data)
    //}).catch(err => {
        //console.log(err)
    //})

    //sendMail(payload, mtime)
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
        subject: 'Cooler status',
        html: `Coller was turned <b style="color:red">${payload}</b> at <b style="color:green;">${mtime}</b>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return
        } else {
            return true
        }
    });

}