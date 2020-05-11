'use strict'

exports.handler = function (event, callback) {
    var nodemailer = require('nodemailer');
    
    var payload = parseInt(event.msg);
    var timestamp = parseInt(event.timestamp);

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
        text: `Core temperature reached ${payload} at ${timestamp}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return
        } else {
            return
        }
    });

    if (callback == null || callback == '') return data
    callback(null, data);
}