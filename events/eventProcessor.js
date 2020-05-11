'use strict'

exports.processEvent = (uModule, inputs) => {
    return new Promise((resolve, reject) => {
        try {

            var mod = require(`./functions/${uModule}/index`)

            var response = mod.handler(inputs)

            return resolve(String(response))

        } catch (e) {
            return reject("Unable to process event <br> " + e)
        }
    })

}