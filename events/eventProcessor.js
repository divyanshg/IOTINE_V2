'use strict'

exports.processEvent = (uModule, inputs, callback) => {
    try {
        
        const mod = require(`./functions/${uModule}`)

        return String(mod.handler(inputs, callback)) 

    } catch (e) {
       return "Unable to process event <br> "+ e
    }
}

