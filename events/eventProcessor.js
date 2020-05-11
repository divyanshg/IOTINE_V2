'use strict'

exports.processEvent = (uModule, inputs, callback) => {
    return new Promise((resolve, reject) => {
        try {

            const mod = require(`./functions/${uModule}/index`)

            return resolve(String(mod.handler(inputs, callback)))

        } catch (e) {
            return reject("Unable to process event <br> " + e)
        }
    })

}