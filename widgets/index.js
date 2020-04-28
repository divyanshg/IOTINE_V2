require('dotenv').config()
var cors = require('cors')
const express = require('express');
var mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

const port = process.env.PORT || 3002;

var con = mysql.createConnection({
    host: "localhost",
    user: "divyanshg21",
    password: "potty_khale",
    database: "fila_iot"
  });
  
con.connect(function(err) {
   if (err) throw err;
   console.log("Connected!");
});


app.get('/widgets/:userId/:appId', (req, res) => {


    var schema =   {
        "name": "",
        "feed":'',
        "type": "",
        "datasets":[{
            "label": "",
            "data": [],
            "backgroundColor": "",
            "borderColor": "",
            "borderWidth": ''
        }],
        "config": {
        "labels": [],
        "type": "",
        "prevTime": "",
        "device": "",
        "tab": ""
        }
    };

    var widgetSchema = [];

    getWidgets(req.params.userId, req.params.appId).then(widgets => {
        widgets.forEach(widget => {
            //BASICS
            schema.name = widget.name;
            schema.feed = widget.feed;
            schema.type = widget.type;
            //DATASETS
            schema.datasets[0].label = widget.label;
            schema.datasets[0].data  = [];
            schema.datasets[0].backgroundColor = widget.backgroundColor;
            schema.datasets[0].borderColor = widget.borderColor;
            schema.datasets[0].borderWidth = widget.borderWidth;
            //CONFIGS
            schema.config.labels = [];
            schema.config.type = widget.chartType;
            schema.config.prevTime = widget.prevTime;
            schema.config.device = widget.device;
            schema.config.tab = widget.tab;

            widgetSchema.push(schema)
            schema = {
                "name": "",
                "feed":'',
                "type": "",
                "datasets":[{
                    "label": "",
                    "data": [],
                    "backgroundColor": "",
                    "borderColor": "",
                    "borderWidth": ''
                }],
                "config": {
                "labels": [],
                "type": "",
                "prevTime": "",
                "device": "",
                "tab": ""
                }
            }
        })

        res.json(widgetSchema)
    }).catch((err) => setImmediate(() => { throw err; }))
})

app.get('/tabs/:userId/:appId', (req, res) => {
    getTabs(req.params.userId, req.params.appId).then(tabs => res.json(tabs)).catch((err) => setImmediate(() => { throw err; }))
})

app.get('/user/:name', (req, res) => {
    con.query('select user_id from users where username = ? limit 1', req.params.name, (err, resp) => {
        if(err) throw err;
        res.send(resp[0].user_id)
    })
});

app.post('/newWidget/:userId/:appId', (req, res) => {
    var widget = req.body
    saveWidget(req.params.userId, req.params.appId, widget)
    res.send("Widget Saved!")
});

app.post('/newTab/:userId/:appId/:tabName', (req,res) => {
    var tab = req.params.tabName;
    saveTab(req.params.userId, req.params.appId, tab)
    res.send("Tab Saved!")
});

app.get('/devices/:userId', (req, res) => {
    getDevices(req.params.userId).then(devices => res.json(devices)).catch((err) => setImmediate(() => { throw err; }))
});

app.post('/newDevice/:userId/:name/:did/:templ', (req, res) => {
    var device = req.params;
    saveDevice(device.userId, device.name, device.did, device.templ)
    res.send("Device Saved!")
});

app.get('/feeds/:userId/:dev/:templ', (req,res) => {
    getFeeds(req.params.user, req.params.dev, req.params.templ).then(feeds => res.json(feeds)).catch((err) => setImmediate(() => { throw err; }))
})

app.get('/templates/:user', (req, res) => {
    getTemplate(req.params.user).then(templates => res.json(templates)).catch((err) => setImmediate(() => { throw err; }))
})

app.post('/newTempl/:userId/:name', (req, res) => {
    var templ = req.params
    saveTemplate(templ.userId, templ.name)
    res.send("Template Saved!")
});

var getWidgets = (user, app) => {
    return new Promise((resolve, reject) => {
        con.query("select * from widgets where user = ? and app = ?", [user, app], function (err, widgets) {
            if (err) return reject(err);
            resolve(widgets)
        });
    })
}

var getTemplate = (user) => {
    return new Promise((resolve, reject) => {
        con.query('select name from template where user = ?', [user], (err, templates) => {
            if(err) return reject(err);
            resolve(templates)
        })
    })
}

var saveWidget = (user, app, widget) => {
    var widgets = [
        [null, user, app, widget.name, widget.feed, widget.type,widget.datasets.label, widget.datasets.data, widget.datasets.backgroundColor, widget.datasets.borderColor, widget.datasets.borderWidth, widget.config.labels, widget.config.type, widget.config.prevTime, widget.config.device, widget.config.tab]
    ]
    con.query("INSERT INTO `widgets`(`id`, `user`, `app`, `name`, `feed`, `type`, `label`, `data`, `backgroundColor`, `borderColor`, `borderWidth`, `labels`, `chartType`, `prevTime`, `device`, `tab`) VALUES ?", [widgets], (err, res) => {
        if(err) throw err;
        return 1
    })
}

var getTabs = (user, app) => {
    return new Promise((resolve, reject) => {
        con.query('select name, tabId from tabs where user =? and app = ?', [user, app], (err, tabs) => {
            if(err) return reject(err);
            resolve(tabs)
        })
    })
}

var saveTab = (user, app, name) => {
    var tab = [
        [null, user, app, name, makeid()]
    ]
    con.query('insert into tabs(id, user, app, name, tabId) VALUES ?', [tab], (err, res) => {
        if(err) throw err;
        return 1
    })
}

var getDevices = (user) => {
    return new Promise((resolve, reject) => {
        con.query('select dName,template from devices where uName = ?', [user], (err, devices) =>{
            if(err) return reject(err);
            resolve(devices)
        })
    })
}

var saveDevice = (user, name, did, templ) => {
    var device = [
        [null, did, name, templ, user]
    ]
    con.query('insert into devices(_id, deviceID, dName, template, uName) values ?', [device], (err, res) => {
        if(err) throw err;
        return 1;
    })
}

var saveTemplate =  (user, name) => {
    var template = [
        [null, name, user]
    ]
    con.query('insert into template(id, name, user) values ?', [template], (err, res) => {
        if(err) throw err;
        return 1;
    })
}

var getFeeds = (user,dev,templ) => {
    return new Promise((resolve, reject) => {
        con.query("select deviceID from devices where uName = ? and dName = ?", [user, dev], (err, res) => {
            if(err) return reject(err);
            console.log(res);resolve(res)
            /*con.query('select name from feed_vals where user_id = ? and deviceID = ?', [user, res[0].deviceID], (err, feeds) => {
                if(err) return reject(err);
                resolve(feeds)
            })*/
        })
    })
}

function makeid() {
    var length = 10;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
app.listen(port, () => console.log("Server running on : "+port))