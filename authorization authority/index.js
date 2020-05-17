const express = require('express')
const jwt = require('jsonwebtoken')
var https = require('https');
const fs = require('fs');

const axios = require('axios')

const app = express();

app.post('/authority/verify/:token/:dev', (req, res) => {

    var token = req.params.token

    if (token.charAt(0) == 'b') token = token.substring(2).slice(0, -1)

    jwt.verify(token, fs.readFileSync('/var/www/html/IOTINE_V2/Collector/certificates/' + req.params.dev + '/key.pem'), (err, authData) => {

        if (err) res.json({
            status: 403
        })

        res.json({
            status: 200
        })
    })
})

/*
app.post('/authority/login', (req,res) => {
    // Mock user

    const user = {
        id:1,
        username: "div"
    }
    // { expiresIn: '30s' }
    jwt.sign({user}, 'ThisIsAKey', (err, token) => {
        
        if(err) res.sendStatus(403);

        res.json({
            token
        })
    })
})
*/

//REDO THIS ONE

function verifyToken(req, res, next) {
    //GET auth header Value

    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader == 'undefined') return res.sendStatus(403)

    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1]

    req.token = bearerToken

    next()
}

app.listen(6543, () => console.log("Server running : 6543"))