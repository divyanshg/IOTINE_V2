'use strict'


var nodemailer = require('nodemailer');

var stateCheck = 0;

exports.handler = function (event, callback) {
    var payload = parseInt(event.msg);
    var mtime = event.timestamp;

    if (payload >= 50 && stateCheck == 0) {
        stateCheck = 1;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'divg809@gmail.com',
                pass: 'div21902'
            }
        });
    
        var mailOptions = {
            from: 'divg809@gmail.com',
            to: 'divyanshg809@gmail.com',
            subject: 'Core temperature was high',
            text: `Core temperature reached ${payload} at ${mtime}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return
            } else {
                return true
            }
        });
    }else if(payload <= 30){
        stateCheck = 0;
    }

    if (callback == null || callback == '') return data
    callback(null, data);
}