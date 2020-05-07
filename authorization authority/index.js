const express = require('express')
const jwt = require('jsonwebtoken')

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message:"Welcome to the API"
    })
})

app.listen(6543, () => console.log("Server running : 6543"))