const express = require('express');
var mysql = require('mysql');

const app = express();

app.use(express.json());

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

app.post('/newWidget/:userId/:appId', (req, res) => {
    res.json(req.body.name)
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
app.listen(port, () => console.log("Server running on : "+port))