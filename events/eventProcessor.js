'use strict'

exports.processEvent = async (uModule, inputs) => {
    return new Promise((resolve, reject) => {
        try {

            var mod = require(`./functions/${uModule}/index`)

            var response = mod.handler(inputs)
            await response

            return resolve(String(response))

        } catch (e) {
            return reject("Unable to process event <br> " + e)
        }
    })

}