'use strict'

const iotine = {

    mailConfig: {emailAddress: '', password: '', service: ''},

    configMail: (args) => {
        this.mailConfig.emailAddress = args.emailAddress;
        this.mailConfig.password = args.password;
        this.mailConfig.service = args.service;
    },

    sendMail: (mailOptions) => {

        var nodemailer = require('nodemailer');

        return new Promise((resolve, reject) => {

            if(this.mailConfig.emailAddress == '' || this.mailConfig.password == '' || this.mailConfig.service == '') return reject("Mail service has not been configured. Use configMail() to configure it now. \n Mail not Sent!")

            var transporter = nodemailer.createTransport({
                service: this.mailConfig.service,
                auth: {
                    user: this.mailConfig.emailAddress,
                    pass: this.mailConfig.password
                }
            });

            var mailOpt = {
                from: this.mailConfig.emailAddress,
                to: mailOptions.reciever,
                subject: mailOptions.subject,
                text: mailOptions.body
            };

            transporter.sendMail(mailOpt, function (error, info) {
                if (error) {
                    return reject(error)
                } else {
                    return resolve(info)
                }
            });
        })

    }
}