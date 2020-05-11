'use strict'

exports.handler = function (event, callback) {
    
    var payload = parseInt(event.msg);
    var timestamp = parseInt(event.time);

    var data = timestamp

    if(callback == null || callback == '') return data
    callback(null, data);
}