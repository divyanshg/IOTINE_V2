var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://192.168.43.147')
client.on('connect', function () {
    client.subscribe('distance')
})
client.on('message', function (topic, message) {
context = message.toString();
console.log(context)
})