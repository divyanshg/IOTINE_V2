var user;
var app = window.location.pathname.split("/")[3];

var Apps = new River({
    el: '#app',
    data: {
        items: [{
            num: 1,
            name: "Smart Home",
            id: "smart_home",
            url: "smart_home.divyanshg809.iotine.com"
        }, {
            num: 2,
            name: "Shop 1",
            id: "shop1",
            url: "shop1.divyanshg809.iotine.com"
        }],
        appcount: 2
    }
})


async function getUser() {
    var username = window.location.pathname.split("/")[2];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            user = xhttp.responseText;

            getDevices()
        }
    };
    xhttp.open("GET", "https://192.168.31.249:3002/user/" + username, true);
    await xhttp.send();
}

var formatRuleName = () => {
    var name = document.querySelector("#rname")
    name.value = name.value.replace(/\s+/g, '-');
}

async function getDevices(val) {
    var devList = document.querySelector('#devicesList')
    if (val != '') {
        $("#devicesList").empty().append('<option value="0">Select your device</option>');
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var resdevice = JSON.parse(xhttp.responseText)
            resdevice.forEach(device => {
                var opt = document.createElement('option')
                opt.innerHTML = device.template + " / " + device.dName
                if (val != '') {
                    opt.value = device.deviceID;
                } else {
                    opt.value = val
                }

                devList.appendChild(opt)
            })
        }
    };
    xhttp.open("GET", "https://192.168.31.249:3002/devices/" + user, true);
    await xhttp.send();
}


async function loadFeeds(dev) {
    var feedLst = document.querySelector("#feedsList");
    var xhttp = new XMLHttpRequest();

    document.querySelector("#feedContainer").style.display = "block"
    $("#feedsList").empty().append('<option value="0">Select your feed</option>')
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var feeds = JSON.parse(xhttp.responseText)
            if (feeds.length != 0) {
                $("#feedsList").empty();
                feeds.forEach(feed => {
                    var opt = document.createElement('option')
                    opt.innerHTML = feed.name
                    opt.value = dev + "/" + feed.name;

                    feedLst.appendChild(opt)
                })
            } else {
                $("#feedsList").empty();
                var opt = document.createElement('option')
                opt.innerHTML = "No feeds found"
                opt.value = 0;

                feedLst.appendChild(opt)
                return
            }
        }
    };
    xhttp.open("GET", "https://192.168.31.249:3002/feeds/" + user + "/" + dev, true);
    await xhttp.send();
}

var editor;

function loadEditor() {
    document.querySelector('.eventFunction').style.display = 'block'
    var code = $("#eventCode")[0];
    editor = CodeMirror.fromTextArea(code, {
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        mode: "javascript",
        extraKeys: {
            "Ctrl-Space": "autocomplete",
            "F11": function (cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
            },
            "Esc": function (cm) {
                if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
            }
        }
    });
    editor.setOption("theme", 'ayu-mirage');
}

var prevRun = false;

async function runCode() {
    if(prevRun){
        document.getElementsByTagName('head')[0].lastElementChild.remove();
        prevRun = false;
    }
    editor.save()
    var scr = document.createElement('script')

    scr.innerHTML = document.querySelector("#testa").value
    scr.innerHTML += document.querySelector("#eventCode").value
    scr.innerHTML += '\n return exports;}'
    document.getElementsByTagName('head')[0].appendChild(scr)

    try {
        $(".runBtn").html("Running with sample data...")
        await tester().handler({
            "user_id": "sample_user",
            "deviceId": "sampleDevice",
            "feed": "Sample_Feed",
            "value": Math.floor(Math.random() * 100),
            "timestamp": Date.now()
        })

        $(".runBtn").html("Run")
    } catch (e) {
        var output = document.querySelector(".output")
        var console = {
            log: (msg) => {
                output.value += "\n" + msg;
                output.scrollTop = output.scrollHeight;
            }
        }
        console.log(e)
        $(".runBtn").html("Run")
    }

    prevRun = true;
}

var brdr = "none";

function newRule(btn) {
    $(".ruleList").toggle()
    $(".rulesForm").toggle()
    var root = document.documentElement
    if (brdr == "none") {
        root.style.setProperty("--brdr", "1px solid rgb(236, 239, 244)")
        btn.innerHTML = "Cancel"
        brdr = true;
    } else {
        root.style.setProperty("--brdr", "none")
        btn.innerHTML = "New Rule"
        brdr = "none"
    }
}

getUser()