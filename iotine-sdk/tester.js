var iotine = require('./index')

iotine = iotine.services

iotine.connectIOT()

iotine.sendMail({
    'emailAddress': 'iotine.alert@gmail.com',
    'Password': 'div21902',
    'service':'gmail',
    'reciever': 'divyanshg809@gmail.com',
    'subject': 'Test MAil',
    'html': '<h2>THIS IS A TEST MAIL</h2>'
})