'use strict'

exports.processEvent = (uModule, inputs) => {
    return new Promise((resolve, reject) => {
        try {

            const mod = require(`./functions/${uModule}/index`)

            var response = mod.handler(inputs)
            await response

            return resolve(String(response))

        } catch (e) {
            return reject("Unable to process event <br> " + e)
        }
    })

}