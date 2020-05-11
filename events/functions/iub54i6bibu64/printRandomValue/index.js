'use strict'

exports.handler = async(event) => {
    return console.error(Math.floor(Math.random() * parseInt(event.msg)))
}