'use strict'

const mysql = require('mysql')
const counter = 0;


exports.processEvent = (uModule, inputs) => {
    return new Promise((resolve, reject) => {
        try {

            Object.keys(require.cache).forEach(function (key) {
                delete require.cache[key]
            })
            var mod = require(`./functions/${uModule}/index`)

            //saveEventSuccessLog(uModule.split("/")[0], uModule.split("/")[1], "Event ran successfully")
            try {
                var output = mod.handler(inputs)
                resolve(String(output))
            } catch (e) {
                //saveEventFailureLog(uModule.split("/")[0], uModule.split("/")[1], e)
                return reject(e)

            }

        } catch (e) {

            //saveEventFailureLog(uModule.split("/")[0], uModule.split("/")[1], e)
            return reject(e)

        }
    })

}
/*
function saveEventSuccessLog(user, event, msg) {
    if(count >= 10) return
    count += 1;
    return new Promise((resolve, reject) => {
        con.query(`INSERT INTO eventLogs(user, event, type, msg) VALUES('${user}', '${event}', 'success', '${msg}')`, (err, resp) => {
            if (err) return reject(err)
            return resolve(resp)
        })
    })
}

function saveEventFailureLog(user, event, err) {
    if(count >= 10) return
    count += 1;
    return new Promise((resolve, reject) => {
        con.query(`INSERT INTO eventLogs(user, event, type, msg) VALUES('${user}', '${event}', 'failure', '${err}')`, (err, resp) => {
            if (err) return reject(err)
            return resolve(resp)
        })
    })
}*/