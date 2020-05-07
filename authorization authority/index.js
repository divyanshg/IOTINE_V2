const express = require('express')
const jwt = require('jsonwebtoken')

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message:"Welcome to the API"
    })
})

app.post('/api/posts', verifyToken, (req, res) => {
    res.json({
        message: "Post created!!"
    })
})

app.post('/api/login', (req,res) => {
    // Mock user
    const user = {
        id:1,
        username: "div"
    }

    jwt.sign({user}, 'ThisIsAKey', (err, token) => {
        if(err) throw err;
        res.json({
            token
        })
    })
})

//REDO THIS ONE

function verifyToken(req, res, next){
    //GET auth header Value
    
    const bearerHeader = req.headers['authorization']

    if(typeof bearerHeader == 'undefined') return res.sendStatus(403)

    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1]

    req.token = bearerToken

    next()
}

app.listen(6543, () => console.log("Server running : 6543"))