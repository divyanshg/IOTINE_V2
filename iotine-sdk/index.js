const io = require('socket.io-client')
const axios = require('axios')
var nodemailer = require('nodemailer');

var sockClient;

var mailConfigs = {
    emailAddress: '',
    Password: '',
    service: ''
}

var services = () => {

    var obj = {
        hello: () => {
            return "test"
        },
        connectIOT: () => {
            sockClient = io.connect("https://192.168.31.249:3000", {
                secure: true,
                rejectUnauthorized: false
            });
        },
        configureUser: (userName, Password) => {

        },
        sendToDevice: async (event, callback) => {
            if (callback != null) {
                callback(sockClient.emit('publish', {
                    user: event.user,
                    deviceId: event.deviceId,
                    feed: event.feed,
                    value: event.msg,
                    time: new Date().toLocaleTimeString()
                }))
                return
            } else {
                sockClient.emit('publish', {
                    user: event.user,
                    deviceId: event.deviceId,
                    feed: event.feed,
                    value: event.msg,
                    time: new Date().toLocaleTimeString()
                })
                return
            }
        },
        sendMail: (mailOptions) => {

            if (mailOptions.emailAddress == '') return Error("Mailing is not configured.")
            var transporter = nodemailer.createTransport({
                service: mailOptions.service,
                auth: {
                    user: mailOptions.emailAddress,
                    pass: mailOptions.Password
                }
            });

            var mailOpts = {
                from: mailConfigs.emailAddress,
                to: mailOptions.reciever,
                subject: mailOptions.subject,
                html: mailOptions.html
            };

            transporter.sendMail(mailOpts, function (error, info) {
                if (error) {
                    return Error(error)
                } else {
                    return info
                }
            });
        }
    }

    return obj;
}

exports.services = services();