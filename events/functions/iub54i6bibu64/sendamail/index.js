'use strict'


var nodemailer = require('nodemailer');

var stateCheck = 0;

exports.handler = async (event) => {

    var payload = parseInt(event.msg);
    var mtime = event.timestamp;

    sendMail(payload, mtime)

    return data

}

function sendMail(payload, mtime) {
    if (payload >= 50 && stateCheck == 0) {
        stateCheck = 1;
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
            text: `Core temperature reached <b style="color:red;>${payload}</b> at <i> style="color:green;">${mtime}</i>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return
            } else {
                return true
            }
        });
    } else if (payload <= 30) {
        stateCheck = 0;
    }
}