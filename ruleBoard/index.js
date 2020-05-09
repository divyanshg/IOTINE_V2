const express = require('express')
var https = require('https');
const fs = require('fs');

const axios = require('axios')

const app = express();

app.post('/query', (req, res) => {
    res.json({
        "msg": "323"
    })
})

app.listen(3003, () => console.log("Server running : 3003"))