'use strict'

exports.processEvent = (uModule, inputs) => {
    return new Promise((resolve, reject) => {
        try {

            const mod = require(`./functions/${uModule}/index`)

            return resolve(String(await mod.handler(inputs)))

        } catch (e) {
            return reject("Unable to process event <br> " + e)
        }
    })

}