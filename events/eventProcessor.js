'use strict'

const mysql = require('mysql')

var con = mysql.createConnection({
    host: "localhost",
    user: "divyanshg21",
    password: "potty_khale",
    database: "fila_iot"
});

con.connect(function (err) {
    if (err) return err;
});


exports.processEvent = (uModule, inputs) => {
    return new Promise((resolve, reject) => {
        try {

            Object.keys(require.cache).forEach(function (key) {
                delete require.cache[key]
            })
            var mod = require(`./functions/${uModule}/index`)

            saveEventSuccessLog(uModule.split("/")[0], uModule.split("/")[1], "Event ran successfully")
            resolve(String(mod.handler(inputs)))

        } catch (e) {

            saveEventFailureLog(uModule.split("/")[0], uModule.split("/")[1], e)
            return reject(e)
            
        }
    })

}

function saveEventSuccessLog(user, event, msg) {
    return new Promise((resolve, reject) => {
        con.query(`INSERT INTO eventLogs(user, event, type, msg) VALUES(${user}, ${event}, 'success', ${msg})`, (err, resp) => {
            if(err) return reject(err)
            return resolve(resp)
        })
    })
}

function saveEventFailureLog(user, event, err) {
    return new Promise((resolve, reject) => {
        con.query(`INSERT INTO eventLogs(user, event, type, msg) VALUES(${user}, ${event}, 'failure', ${err})`, (err, resp) => {
            if(err) return reject(err)
            return resolve(resp)
        })
    })
}