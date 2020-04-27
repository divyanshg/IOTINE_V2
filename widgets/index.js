require('dotenv').config()
var cors = require('cors')
const express = require('express');
var mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
}

var widgetSchema = []

app.get('/widgets/:userId/:appId', (req, res) => {
    res.json(getWidgets(req.params.userId, req.params.appId))
})

app.get('/tabs/:userId/:appId', (req, res) => {
    res.json(
        [
            {
                name:"GRAPHS",
                id:"ghjk213"
            },
            {
                name:"TAB2",
                id:"dpkgk213"
            },
            {
                 name:"Fridge Control",
                 id:"rertre"     
            }
        ]
    )
})

app.get('/newWidget/:userId/:appId', (req, res) => {
    var widget = req.body
    saveWidget(req.params.userId, req.params.appId, widget)
})

var getWidgets = (user, app) => {
    con.query("select * from widgets where user = ? and app = ?", [user, app], function (err, widgets) {
        if (err) throw err;
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
    });

    return widgetSchema
}

var saveWidget = (user, app, widget) => {
    var widgets = [
        [null, widget.user, widget.app, widget.name, widget.feed, widget.type,widget.datasets.label, widget.datasets.data, widget.datasets.backgroundColor, widget.datasets.borderColor, widget.datasets.borderWidth, widget.config.labels, widget.config.type, widget.config.prevTime, widget.config.device, widget.config.tab]
    ]
    con.query("INSERT INTO `widgets`(`id`, `user`, `app`, `name`, `feed`, `type`, `label`, `data`, `backgroundColor`, `borderColor`, `borderWidth`, `labels`, `chartType`, `prevTime`, `device`, `tab`) VALUES ?", [widgets], (err, res) => {
        if(err) throw err;
        res.send("Widget Saved!")
    })
}
app.listen(port, () => console.log("Server running on : "+port))