'use strict'

exports.processEvent = (uModule, inputs) => {
    return new Promise((resolve, reject) => {
        try {

            Object.keys(require.cache).forEach(function(key) { delete require.cache[key] })
            var mod = require(`./functions/${uModule}/index`)

            var response = mod.handler(inputs)

            resolve(String(response))

        } catch (e) {
            reject("Unable to process event <br> " + e)
        }
    })

}