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
        "datasets":{
            "label": "",
            "data": [],
            "backgroundColor": "",
            "borderColor": "",
            "borderWidth": ''
        },
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
            schema.datasets.label = widget.label;
            schema.datasets.data  = widget.data;
            schema.datasets.backgroundColor = widget.backgroundColor;
            schema.datasets.borderColor = widget.borderColor;
            schema.datasets.borderWidth = widget.borderWidth;
            //CONFIGS
            schema.config.labels = widget.labels;
            schema.config.type = widget.chartType;
            schema.config.prevTime = widget.prevTime;
            schema.config.device = widget.device;
            schema.config.tab = widget.tab;

            widgetSchema.push(schema)
        })

        res.json(widgetSchema)

        schema = {}
    }).catch((err) => setImmediate(() => { throw err; }))
})

app.get('/tabs/:userId/:appId', (req, res) => {

    var tabschema = {
        "id": '',
        "name": ''
    };
    
    var tabSchema = [];

    getTabs(req.params.userId, req.params.appId).then(tabs => {

        tabs.forEach(tab => {
            tabschema.id = tab.tabId;
            tabschema.name = tab.name;

            tabSchema.push(tab)
        })

        res.json(tabSchema)

        tabschema = {}
    }).catch((err) => setImmediate(() => { throw err; }))
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

var getWidgets = (user, app) => {
    return new Promise((resolve, reject) => {
        con.query("select * from widgets where user = ? and app = ?", [user, app], function (err, widgets) {
            if (err) return reject(err);
            resolve(widgets)
        });
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
        con.query('select * from tabs where user =? and app = ?', [user, app], (err, tabs) => {
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