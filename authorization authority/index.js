const express = require('express')
const jwt = require('jsonwebtoken')

const app = expres();

app.get('/api', (req, res) => {
    res.json({
        message:"WELCOME to the API"
    })
})

app.listen(6543, () => console.log("Server running : 6543"))