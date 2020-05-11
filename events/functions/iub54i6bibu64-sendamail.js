'use strict'

exports.handler = function (event, callback) {
    
    var payload = parseInt(event.msg);
    var timestamp = parseInt(event.timestamp);

    console.log(timestamp)

    if(callback == null || callback == '') return data
    callback(null, data);
}