const express = require('express')
var https = require('http');
const fs = require('fs');

const app = express();

app.get('/query', (req, res) => {
    res.json({
        "msg": "323"
    })
})

app.listen(3003, () => console.log("Server running : 3003"))