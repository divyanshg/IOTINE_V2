const express = require('express');
var mysql = require('mysql');

const app = express();

app.use(express.json());

const port = process.env.PORT || 3002;

var con = mysql.createConnection({
    host: "localhost",
    user: "divyanshg21",
    password: "potty_khale"
  });
  
con.connect(function(err) {
   if (err) throw err;
   console.log("Connected!");
});

app.get('/widgets/:userId/:appId', (req, res) => {
    res.json(
        [
            {
                name: "Distance",
                feed: ["retg54"],
                type: "chart",
                datasets:[{
                    label: "retg54",
                    data: [],
                    backgroundColor: "transparent",
                    borderColor: "red",
                    borderWidth: 1
                }],
                config: {
                    labels: [],
                    type:"line",
                    prevTime: 're',
                    device:"qwerty12",
                    tab:"ghjk213"
                }

            }
        ]
    );
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

app.listen(port, () => console.log("Server running on : "+port))