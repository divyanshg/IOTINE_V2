require('dotenv').config()
var cors = require('cors')
const express = require('express');
var mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

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

var con = mysql.createConnection({
    host: "localhost",
    user: "divyanshg21",
    password: "potty_khale",
    database: "fila_iot"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
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
    con.query('select user_id from users where username = ? limit 1', [req.params.name], (err, resp) => {
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
        con.query("select * from widgets where user = ? and app = ?", [user, app], function (err, widgets) {
            if (err) return reject(err);
            resolve(widgets)
        });
    })
}


var updateWidget = (user, app, widget) => {
    return new Promise((resolve, reject) => {
        con.query('UPDATE widgets SET name = ?, feed = ?, backgroundColor = ?, borderColor = ?, borderWidth = ?, device = ?, label = ? WHERE id = ? ', [widget.name, widget.feed, widget.datasets[0].backgroundColor, widget.datasets[0].borderColor, widget.datasets[0].borderWidth, widget.config.device, widget.feed, widget.id], (err, res) => {
            if (err) return reject(err);
            resolve(res)
        })
    })
}

var getTemplate = (user) => {
    return new Promise((resolve, reject) => {
        con.query('select name from template where user = ?', [user], (err, templates) => {
            if (err) return reject(err);
            resolve(templates)
        })
    })
}

var saveWidget = (user, app, widget) => {
    var widgets = [
        [null, user, app, widget.name, widget.feed, widget.type, widget.datasets[0].label, widget.datasets[0].backgroundColor, widget.datasets[0].borderColor, widget.datasets[0].borderWidth, widget.config.type, widget.config.prevTime, widget.config.device, widget.config.tab]
    ]
    con.query("INSERT INTO `widgets`(`id`, `user`, `app`, `name`, `feed`, `type`, `label`,  `backgroundColor`, `borderColor`, `borderWidth`,`chartType`, `prevTime`, `device`, `tab`) VALUES ?", [widgets], (err, res) => {
        if (err) throw err;
        return 1
    })
}

var getTabs = (user, app) => {
    return new Promise((resolve, reject) => {
        con.query('select name, tabId from tabs where user =? and app = ?', [user, app], (err, tabs) => {
            if (err) return reject(err);
            resolve(tabs)
        })
    })
}

var saveTab = (user, app, name) => {
    var tab = [
        [null, user, app, name, makeid()]
    ]
    con.query('insert into tabs(id, user, app, name, tabId) VALUES ?', [tab], (err, res) => {
        if (err) throw err;
        return 1
    })
}

var getDevices = (user, dev) => {
    return new Promise((resolve, reject) => {
        con.query('select dName,template,deviceID,fver from devices where uName = ?', [user], (err, devices) => {
            if (err) return reject(err);
            resolve(devices)
        })
    })
}

var saveDevice = (user, name, did, templ) => {
    var device = [
        [null, did, name, templ, user]
    ]
    con.query('insert into devices(_id, deviceID, dName, template, uName) values ?', [device], (err, res) => {
        if (err) throw err;
        return 1;
    })
}

var saveTemplate = (user, name) => {
    var template = [
        [null, name, user]
    ]
    con.query('insert into template(id, name, user) values ?', [template], (err, res) => {
        if (err) throw err;
        return 1;
    })
}


var getFeeds = (user, dev, templ) => {
    return new Promise((resolve, reject) => {
        con.query('select name,unit from feed_vals where user_id = ? and deviceID = ?', [user, dev], (err, feeds) => {
            if (err) return reject(err);
            resolve(feeds)
        })
    })
}

var getProps = (user, device) => {
    return new Promise((resolve, reject) => {
        con.query('select dName,deviceID,template from devices where uName =? and deviceID = ?', [user, device], (err, props) => {
            if (err) return reject(err);
            resolve(props)
        })
    })
}

var getDeviceState = (user) => {
    return new Promise((resolve, reject) => {
        con.query('select deviceID,status from devices where uName = ?', [user], (err, stats) => {
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