'use strict'


var nodemailer = require('nodemailer');

var stateCheck = 0;

exports.handler = async (event) => {

    var payload = parseInt(event.msg);
    var mtime = event.timestamp;

    await sendMail(payload, mtime)
    
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
            text: `Core temperature reached ${payload} on ${mtime}`
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

    console.log("Sent!!")
}