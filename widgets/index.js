require('dotenv').config()
var cors = require('cors')
const express = require('express');

const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const options = {
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt'),
    ca:[fs.readFileSync('./ca_bundle.crt')]
};
var http = require('https')

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors())

const port = process.env.PORT || 3002;

var dataCamp;

MongoClient.connect(url, {useUnifiedTopology: true}, function (err, db) {
    if (err) throw err;
    dataCamp = db.db("fila_iot");
});



app.get('/widgets/:userId/:appId', (req, res) => {


    var schema = {
        "id": "",
        "name": "",
        "feed": '',
        "type": "",
        "datasets": [{
            "label": "",
            "data": [],
            "backgroundColor": "",
            "borderColor": "",
            "borderWidth": ''
        }],
        "config": {
            "labels": [],
            "type": "",
            "minval": "",
            "maxval": "",
            "value": "",
            "textColor": "",
            "text": "",
            "changeText": "",
            "src": "",
            "color": "",
            "dataPoints": "",
            "prevTime": "",
            "device": "",
            "tab": ""
        }
    };

    var widgetSchema = [];

    getWidgets(req.params.userId, req.params.appId).then(widgets => {
        widgets.forEach(widget => {
            //BASICS
            schema.id = widget.id;
            schema.name = widget.name;
            schema.feed = widget.feed;
            schema.type = widget.type;
            //DATASETS
            schema.datasets[0].label = widget.label;
            schema.datasets[0].data = [];
            schema.datasets[0].backgroundColor = widget.backgroundColor;
            schema.datasets[0].borderColor = widget.borderColor;
            schema.datasets[0].borderWidth = widget.borderWidth;
            //CONFIGS
            schema.config.labels = [];
            schema.config.minval = widget.minval;
            schema.config.maxval = widget.maxval;
            schema.config.value = widget.value;
            schema.config.textColor = widget.color;
            schema.config.text = widget.text;
            schema.config.changeText = widget.changeText;
            schema.config.src = widget.src;
            schema.config.color = widget.color;
            schema.config.dataPoints = widget.dataPoints

            schema.config.type = widget.chartType;
            schema.config.prevTime = widget.prevTime;
            schema.config.device = widget.device;
            schema.config.tab = widget.tab;

            widgetSchema.push(schema)
            schema = {
                "id": "",
                "name": "",
                "feed": '',
                "type": "",
                "datasets": [{
                    "label": "",
                    "data": [],
                    "backgroundColor": "",
                    "borderColor": "",
                    "borderWidth": ''
                }],
                "config": {
                    "labels": [],
                    "type": "",
                    "minval": "",
                    "maxval": "",
                    "value": "",
                    "textColor": "",
                    "text": "",
                    "changeText": "",
                    "src": "",
                    "color": "",
                    "dataPoints": "",
                    "prevTime": "",
                    "device": "",
                    "tab": ""
                }
            }
        })

        res.json(widgetSchema)
    }).catch((err) => setImmediate(() => {
        throw err;
    }))
})

app.post('/updateWidget/:user/:app', (req, res) => {
    var widget = req.body
    updateWidget(req.params.userId, req.params.appId, widget).then(widget => res.send("OK")).catch((err) => setImmediate(() => {
        throw err;
    }))
})

app.get('/tabs/:userId/:appId', (req, res) => {
    getTabs(req.params.userId, req.params.appId).then(tabs => res.json(tabs)).catch((err) => setImmediate(() => {
        throw err;
    }))
})

app.get('/virtualDevice/:user/:name/:templ/:id', (req, res) => {
    var device = req.params;
    if (!fs.existsSync(`/var/www/html/IOTINE_V2/Collector/certificates/${device.id}/`)) {
        fs.mkdirSync(`/var/www/html/IOTINE_V2/Collector/certificates/${device.id}/`);
    }

    fs.copyFile('/var/www/html/IOTINE_V2/key.pem', `/var/www/html/IOTINE_V2/Collector/certificates/${device.id}/key.pem`, (err) => {
        if (err) throw err;

        saveDevice(device.user, device.name, device.id, device.templ)
        res.send("Device Saved!")
    });
})

app.get('/user/:name', (req, res) => {
    dataCamp.collection("users").find({username: req.params.name}, {projection: {user_id:1}}).toArray((err, resp) => {
        if (err) return err;
        if (typeof resp[0] == 'undefined') return
        res.send(resp[0].user_id)
    })
});

app.post('/newWidget/:userId/:appId', (req, res) => {
    var widget = req.body
    saveWidget(req.params.userId, req.params.appId, widget)
    res.send("Widget Saved!")
});

app.post('/newTab/:userId/:appId/:tabName', (req, res) => {
    var tab = req.params.tabName;
    saveTab(req.params.userId, req.params.appId, tab)
    res.send("Tab Saved!")
});

app.get('/devices/:userId', (req, res) => {
    getDevices(req.params.userId).then(devices => res.json(devices)).catch((err) => setImmediate(() => {
        throw err;
    }))
});

app.post('/newDevice/:userId/:name/:did/:templ', (req, res) => {
    var device = req.params;
    saveDevice(device.userId, device.name, device.did, device.templ)
    res.send("Device Saved!")
});

app.get('/feeds/:userId/:dev', (req, res) => {
    getFeeds(req.params.userId, req.params.dev).then(feeds => res.json(feeds)).catch((err) => setImmediate(() => {
        throw err;
    }))
})

app.get('/templates/:user', (req, res) => {
    getTemplate(req.params.user).then(templates => res.json(templates)).catch((err) => setImmediate(() => {
        throw err;
    }))
})

app.post('/newTempl/:userId/:name', (req, res) => {
    var templ = req.params
    saveTemplate(templ.userId, templ.name)
    res.send("Template Saved!")
});

app.get('/devProps/:user/:dev', (req, res) => {
    getProps(req.params.user, req.params.dev).then(props => res.json(props)).catch((err) => setImmediate(() => {
        throw err;
    }))
})

app.get('/deviceState/:user', (req, res) => {
    getDeviceState(req.params.user).then(stat => res.json(stat)).catch((err) => setImmediate(() => {
        throw err;
    }))
})


app.get('/runRule/:user/:code', (req, res) => {
    console.log("here")
    res.json({
        "status": 200
    })
    console.log(req.params.code)
})

var getWidgets = (user, app) => {
    return new Promise((resolve, reject) => {
        dataCamp.collection("widgets").find({user: user, app: app}).toArray((err, widgets) => {
            if (err) return reject(err);
            resolve(widgets)
        });
    })
}


var updateWidget = (user, app, widget) => {
    return new Promise((resolve, reject) => {
        dataCamp.collection("widgets").updateOne({id: widget.id}, { $set: {name: widget.name,feed: widget.feed,backgroundColor: widget.datasets[0].backgroundColor,borderColor: widget.datasets[0].borderColor,borderWidth: widget.datasets[0].borderWidth,device: widget.config.device,label: widget.feed} }, (err, res) => {
            if (err) return reject(err);
            resolve(res)
        })
    })
}

var getTemplate = (user) => {
    return new Promise((resolve, reject) => {
        dataCamp.collection("template").find({user: user}, { projection: {name:1} }).toArray((err,res) => {
            if (err) return reject(err);
            resolve(templates)
        })
    })
}

var saveWidget = (user, app, widget) => {
    dataCamp.collection("widgets").insertOne({user, app,name: widget.name,feed: widget.feed,type: widget.type,label: widget.datasets[0].label,backgroundColor: widget.datasets[0].backgroundColor,borderColor: widget.datasets[0].borderColor,borderWidth: widget.datasets[0].borderWidth,chartType: widget.config.type,prevTime: widget.config.prevTime,device: widget.config.device,tab: widget.config.tab}, (err, res) => {
        if (err) throw err;
        return 1
    })
}

var getTabs = (user, app) => {
    return new Promise((resolve, reject) => {
        dataCamp.collection("tabs").find({user: user, app: app}, { projection: {name:1, tabId:1} }).toArray((err,tabs) => {
            if (err) return reject(err);
            resolve(tabs)
        })
    })
}

var saveTab = (user, app, name) => {
    dataCamp.collection("tabs").insertOne({user, app, name, tabId: makeid()}, (err, res) => {
        if (err) throw err;
        return 1
    })
}

var getDevices = (user, dev) => {
    return new Promise((resolve, reject) => {
        dataCamp.collection("devices").find({uName: user}, { projection: {dName:1, template:1, deviceID:1, fver:1} }).toArray((err, devices) => {
            if (err) return reject(err);
            resolve(devices)
        })
    })
}

var saveDevice = (uName, dName, deviceID, template) => {
    dataCamp.collection("devices").insertOne({deviceID, dName, template, uName}, (err, res) => {
        if (err) throw err;
        return 1;
    })
}

var saveTemplate = (user, name) => {
    dataCamp.collection("template").insertOne({name, user}, (err, res) => {
        if (err) throw err;
        return 1;
    })
}


var getFeeds = (user, dev, templ) => {
    return new Promise((resolve, reject) => {
        dataCamp.collection("feed_vals").find({deviceID: dev, user_id: user}, {projection: {name:1, unit:1} }).toArray((err,feeds) => {
            if (err) return reject(err);
            resolve(feeds)
        })
    })
}

var getProps = (user, device) => {
    return new Promise((resolve, reject) => {
        dataCamp.collection("devices").find({"uName": user, "deviceID": device}, { projection: {dName: 1, deviceID:1, template:1} }).toArray((err, props) => {
            if (err) return reject(err);
            resolve(props)
        })
    })
}

var getDeviceState = (user) => {
    return new Promise((resolve, reject) => {
        dataCamp.collection("devices").find({"uName": user}, { projection: {status: 1, deviceID: 1} }).toArray((err, stats) => {
            if (err) reject(err);
            resolve(stats)
        })
    })
}

function makeid() {
    var length = 10;
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

http.createServer(options, app).listen(port, () => console.log("Server running on : " + port));