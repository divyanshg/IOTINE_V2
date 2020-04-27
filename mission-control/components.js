var widgets = [{
    feed: "retg54",
    dataset: [{
        label: '# of Votes',
        data: [],
        backgroundColor: '#98fb987a',
        borderColor: 'green',
        borderWidth: 1
    }]
}]

var streams = [{
    feed: "retg54",
    widgets: ["line-visualizer"]
}]

//COMPONENTS 
River.component('line-visualizer', {
    props: ['id'],
    data: function () {
        return {
            compId: this.id
        }
    },
    template: '<canvas :id="id" width="400" height="225"></canvas>',

    created: function (event) {
        setTimeout(function () {
            console.log(event)
            //document.querySelector('#lineVisualizer').id = id
            var ctx = document.getElementById('bla').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets:widgets[0].dataset
                },
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            gridLines: {
                                display: false
                            }
                        }],
                        xAxes: [{
                            gridLines: {
                                display: false
                            }
                        }]
                    }
                }
            });

        }, 10);
    },
    watch: {
        id: function (iD) {
            this.compId = iD
        },

    }
})

River.component('bar-visualizer', {
    props: ['id'],
    data: function () {
        return {
            compId: this.id
        }
    },
    template: '<canvas :id="id" width="400" height="225"></canvas>',
    created: function () {
        setTimeout(function () {
            //document.querySelector('#lineVisualizer').id = id
            var ctx = document.getElementById('rnd').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: '# of Votes',
                        data: [],
                        borderWidth: 1
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            gridLines: {
                                display: false
                            }
                        }],
                        xAxes: [{
                            gridLines: {
                                display: false
                            }
                        }]
                    }
                }
            });

        }, 10);
    },
    watch: {
        id: function (iD) {
            this.compId = iD
        },

    }
})

River.component('pie-visualizer', {
    props: ['id'],
    data: function () {
        return {
            compId: this.id
        }
    },
    template: '<canvas :id="id" width="400" height="225"></canvas>',
    created: function () {
        setTimeout(function () {
            //document.querySelector('#lineVisualizer').id = id
            var ctx = document.getElementById('pie').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Red', 'Blue', 'Yellow'],
                    datasets: [{
                        label: '# of Votes',
                        data: [12, 19, 3],
                        backgroundColor: '#98fb987a',
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            gridLines: {
                                display: false
                            }
                        }],
                        xAxes: [{
                            gridLines: {
                                display: false
                            }
                        }]
                    }
                }
            });

        }, 10);
    },
    watch: {
        id: function (iD) {
            this.compId = iD
        },

    }
})

River.component('gauge', {
    props:["id"],
    template:'<div :id="id" class="gauge-holder"></div>'
})
var dash = new River({
    el: '.maindash'
})
/*
var widgets = [{
    id: "some",
    type: "chart",
    feed: "retg54",
    backgroundColor: "red",
    borderColor: "green"
}, {
    id: "thisisGauge",
    type: "gauge",
    feed: "retg54",
    backgroundColor: "red",
    borderColor: "green"
}]


function renderChart(id, options) {
    var ctx = document.getElementById(id);
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["red", "green", "blue"],
            datasets: [{
                label: 'Distance',
                data: [12, 13, 14],
                backgroundColor: options.backgroundColor,
                borderColor: options.borderColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            animation: false,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    gridLines: {
                        display: false
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            }
        }
    });

}

function Gauge(el) {

    // ##### Private Properties and Attributes

    var element, // Containing element for the info component
        data, // `.gauge--data` element
        needle, // `.gauge--needle` element
        value = 0.0, // Current gauge value from 0 to 1
        prop; // Style for transform

    // ##### Private Methods and Functions

    var setElement = function (el) {
        // Keep a reference to the various elements and sub-elements
        element = el;
        data = element.querySelector(".gauge_c");
        //needle = element.querySelector(".gauge--needle");
    };

    var setValue = function (x) {
        value = x;
        var turns = -0.5 + (x * 0.5);
        data.style[prop] = "rotate(" + turns + "turn)";
        //needle.style[prop] = "rotate(" + turns + "turn)";
    };

    // ##### Object to be Returned

    function exports() {};

    // ##### Public API Methods

    exports.element = function (el) {
        if (!arguments.length) {
            return element;
        }
        setElement(el);
        return this;
    };

    exports.value = function (x) {
        if (!arguments.length) {
            return value;
        }
        setValue(x);
        return this;
    };

    // ##### Initialization

    var body = document.getElementsByTagName("body")[0];
    ["webkitTransform", "mozTransform", "msTransform", "oTransform", "transform"].
    forEach(function (p) {
        if (typeof body.style[p] !== "undefined") {
            prop = p;
        }
    });

    if (arguments.length) {
        setElement(el);
    }

    return exports;


};

function createElm(tag) {
    var elm = document.createElement(tag);
    return elm
}

function makeWidgetBody() {
    var main = $(".maindash");

    var widgetBody = createElm("div");
    widgetBody.className = "widget";

    main.append(widgetBody);

    return widgetBody
}

function createChartWidget(options) {
    var canvas = createElm("canvas")
    canvas.id = "wid_" + options.id

    var widgetBody = makeWidgetBody()
    widgetBody.append(canvas)

    //renderChart("bla", options)
}

function createGaugeWidget(options) {
    var widgetBody = makeWidgetBody()

    var gauge = createElm("div")
    gauge.className = "gauge"
    gauge.id = "gauge_" + options.id

    $(gauge).append('<div class="gauge-a"></div><div class="gauge-b"></div><div class="gauge-c"></div><div class="gauge-data"><h1 id="percent">0%</h1></div>')

    widgetBody.append(gauge)

    var randu = 50 //Math.floor(Math.random() * 90)
    $(".gauge-c").css("transform", "rotate(" + (randu + 5) * 2 + "deg)");
    $("#percent").html(randu + "%")
}

function newWidget() {
    widgets.forEach(widget => {
        if (widget.type == 'chart') {
            createChartWidget(widget)
        } else if (widget.type == 'gauge') {
            createGaugeWidget(widget)
        }
    })
}


var socket = io();

newWidget()


var dps = []; // dataPoints
var chart = new CanvasJS.Chart("bla", {
    title: {
        text: "Dynamic Data"
    },
    axisY: {
        includeZero: false
    },
    data: [{
        type: "line",
        dataPoints: dps
    }]
});

var xVal = 0;
var yVal = 100;
var updateInterval = 1000;
var dataLength = 20; // number of dataPoints visible at any point

var updateChart = function (count) {

    count = count || 1;

    for (var j = 0; j < count; j++) {
        yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
        dps.push({
            x: xVal,
            y: yVal
        });
        xVal++;
    }

    if (dps.length > dataLength) {
        dps.shift();
    }

    chart.render();
};

updateChart(dataLength);
setInterval(function () {
    updateChart()
}, updateInterval);


socket.on('subscribe', (feed, msg) => {
    $(".gauge-c").css("transform", "rotate(" + msg.value + "deg)");
    $("#percent").html(msg.value + "%")
})*/