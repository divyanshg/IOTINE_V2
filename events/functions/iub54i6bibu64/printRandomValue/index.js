'use strict'

exports.handler = async(event) => {
    return Math.floor(Math.random() * 100)
}