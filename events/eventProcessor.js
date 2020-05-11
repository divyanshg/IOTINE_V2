'use strict'

exports.processEvent = (uModule, inputs) => {
    return new Promise((resolve, reject) => {
        try {

            Object.keys(require.cache).forEach(function(key) { delete require.cache[key] })
            var mod = require(`./functions/${uModule}/index`)

            resolve(String(mod.handler(inputs)))

        } catch (e) {
            reject("Unable to process event <br> " + e)
        }
    })

}