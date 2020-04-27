var socket = io();

widgets = [{
    name: "Distance",
    feed: "retg54",
    type: "line",
    config: {
        bgcolor: "transparent",
        borderColor: "red",
        data: [12, 13, 14, 15, 16, 17, 18, 19, 20],
        labels: ["12", "13", "14", "15", "16", "17", "18", "19", "20"]
    }

}, {
    name: "Temperature",
    feed: "Web_Sensor",
    type: "line",
    config: {
        bgcolor: "transparent",
        borderColor: "green",
        data: [12, 13, 14, 15, 16, 17, 18, 19, 20],
        labels: ["12", "13", "14", "15", "16", "17", "18", "19", "20"]
    }
},{
    name: "Light Intensity",
    feed: "Web_Sensor",
    type: "line",
    config: {
        bgcolor: "transparent",
        borderColor: "green",
        data: [12, 13, 14, 15, 16, 17, 18, 19, 20],
        labels: ["12", "13", "14", "15", "16", "17", "18", "19", "20"]
    }
}]


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



var dataa = []
var labla = []
var colors = []

function lineChart(id, config, widgetBdy) {
    var chartContainer = document.createElement("canvas");
    chartContainer.className += "chart"

    chartContainer.id = "wid-" + id

    chartContainer.width = "325"
    chartContainer.height = "180"


    widgetBdy.appendChild(chartContainer)
    document.querySelector(".maindash").appendChild(widgetBdy)

    var ctx = document.getElementById(chartContainer.id).getContext("2d");

    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1,2,3,4,5,6,7],
            datasets: [{
                label: id,
                data: [1,2,3,4,5,6,7],
                backgroundColor: config.bgcolor,
                borderColor: config.borderColor,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            animation: false,
        }
    });
}



function createWidget() {
    widgets.forEach(widget => {
        var widgetBdy = document.createElement('div')
        widgetBdy.className += 'widget';
        if (widget.type == "line") {
            lineChart(widget.feed, widget.config, widgetBdy)
        }
    })
}


/*function updateChart(id, ctx, msg) {
    let labla = [0]
    var config = msg.config
    var prevData = document.getElementById(id).getAttribute('data-set')
    prevData = prevData + ", " + msg.value
    document.getElementById(id).setAttribute('data-set', prevData)
    pdata = prevData.split(', ');

    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labla,
            datasets: [{
                label: msg.feed,
                data: dataa,
                backgroundColor: "transparent",
                borderColor: "#f16464",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            animation: false,
        }
    });

    var data = chart.data.datasets[0].data;
    var labels = chart.data.labels;

    /*if (pdata.length >= 5 && labels.length >= 5) {
        pdata.shift()
        document.getElementById(id).setAttribute('data-set', pdata)
        console.log(pdata)
        labels.shift()
        colors.shift()

        chart.data.datasets[0].data = pdata
        labels.push(msg.time)
        colors.push("#64bdf1") //getRandomColor())
        chart.update()
    } else {
    chart.data.datasets[0].data = pdata
    chart.data.labels.push(msg.time)
    colors.push("#64bdf1") //getRandomColor())
    chart.update()
    //}
}
socket.on('subscribe', (feed, msg) => {
    feeds.forEach(mfeed => {
        if (mfeed == feed) {
            var ctx = document.getElementById("wid-" + feed).getContext("2d")
            updateChart("wid-" + feed, ctx, msg)
        } else {
            return
        }
    })
});*/

createWidget()
