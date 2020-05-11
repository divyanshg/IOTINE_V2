'use strict'

exports.handler = function (event, callback) {
    
    var payload = parseInt(event.msg);
    var timestamp = parseInt(event.timestamp);

    var data = payload

    console.log(`data recieved : ${data}`)
    if(callback == null || callback == '') return data
    callback(null, data);
}