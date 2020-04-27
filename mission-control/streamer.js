setTimeout(function () {
    var numbers = [];
    var numbers2 = [];
    var labels = [];
    var labels2 = [];
    var clr = getRandomColor();

    var context = document.getElementById("bla");
    var config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Distance',
                data: numbers,
                backgroundColor: '#98fb987a',
                borderColor: 'green',
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
    }
    var chart = new Chart(context, config);

    var socket = io();

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function send() {
        /* socket.emit('publish', {
             user: 'iub54i6bibu64',
             deviceId: 'SkNCX1RSVUNLXzAxYWFk',
             feed: 'retg54',
             value: Math.floor(Math.random() * 100) +10,
             time: new Date().toLocaleTimeString()
         })*/
        socket.broadcast.emit('tester', 'hi')
    }

    socket.on("tester", msg => console.info(msg))
    socket.on('subscribe', (feed, msg) => {

        if (feed == "retg54") {
            if (numbers.length == 5) {
                numbers.shift();
                //numbers2.shift();
                labels.shift()
                numbers.push(msg.value);
                //numbers2.push(Math.floor(Math.random() * 100) +10);
                time = msg.time
                
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                labels.push(time)
                clr = getRandomColor()
                chart.update();
            } else {
                numbers.push(msg.value);
                //numbers2.push(Math.floor(Math.random() * 100) +10);
                time = msg.time
                
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                labels.push(time)
                clr = getRandomColor()
                chart.update();
            }
        } else if(feed == 'RoomPresence'){
            var elm = document.querySelector("#message")
            elm.innerHTML = msg.value
        }else {
            var context2 = document.getElementById("rnd");
            var config2 = {
                type: 'line',
                data: {
                    labels: labels2,
                    datasets: [{
                        label: 'Temperature',
                        data: numbers2,
                        backgroundColor: 'transparent',
                        borderColor: 'red',
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
            }
            var chart2 = new Chart(context2, config2);
            if (numbers2.length == 5) {
                numbers2.shift();
                //numbers2.shift();
                labels2.shift()
                numbers2.push(msg.value);
                //numbers2.push(Math.floor(Math.random() * 100) +10);
                time = msg.time
                
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                labels2.push(time)
                chart2.update();
            } else {
                numbers2.push(msg.value);
                //numbers2.push(Math.floor(Math.random() * 100) +10);
                time = msg.time
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                time = time.slice(0,-1)
                labels2.push(time)
                clr = getRandomColor()
                chart2.update();
            }
            //console.log(msg)
        }
    })
}, 3000)