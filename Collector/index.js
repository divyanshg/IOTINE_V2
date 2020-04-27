const dataCamp = require('../Data-Camp/dataCamp').dataCamp
const express = require('express');
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//*******************************************//
//               __ROUTES__                 //
//*****************************************//

app.get('/', function (req, res) {
    return res.send({
        error: true,
        message: 'hello'
    })
});

app.get('/subscribe/:user/:devId/:feed', (req, res) => {
    dataCamp.getFeedValue(req.params.user, req.params.devId, req.params.feed, feed => {
        return res.send(feed)
    })
});

app.post('/publish/:user/:devId/:feed/:value', (req, res) => {
    dataCamp.updateFeed(req.params.user, req.params.devId, req.params.feed, req.params.value, resp => {
        return res.status(200).send({
            Message: 'Value inserted'
        })
    })
});

app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});