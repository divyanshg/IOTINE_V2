'use strict'



var iotine = require('../../../../iotine')
iotine = iotine.iotine;

var stateCheck = 0;

exports.handler = async (event) => {


    iotine.configMail({emailAddress: 'iotine.alert@gmail.com', password: 'div21902', service: 'gmail'})

    var payload = parseInt(event.msg);
    var mtime = event.timestamp;

    await sendMail(payload, mtime)
    
}

function sendMail(payload, mtime) {
    if (payload >= 50 && stateCheck == 0) {
        stateCheck = 1;
        
        iotine.sendMail().then(response => {
            console.log(response)
        }).catch(err => {
            console.log(err)
        })

    } else if (payload <= 10) {
        stateCheck = 0;
    }
}