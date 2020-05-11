'use strict'

exports.handler = async(event) => {
    return console.log(Math.floor(Math.random() * 100))
}