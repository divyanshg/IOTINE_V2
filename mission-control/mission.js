function toggleDis(elm) {
    var elm = document.querySelector(elm);
    if (elm.style.display == "none") {
        elm.style.display = "block"
    } else if (elm.style.display == "block") {
        elm.style.display = "none"
    }
}

function linkactive(elm) {
    var prev = document.querySelector('.active')
    prev.classList.remove("active")
    elm.className += ' active'
}

function dashactive(elm) {
    var prev = document.querySelector('.dashSwitch.active')
    prev.classList.remove("active")
    elm.className += ' active'
}

var openedPanels = '';

var dashSettings = new River({
    el: '#dash_settings',
    data: {
        icon: ''
    },
    methods: {
        toggleSettingsMenu: () => {
            $('.mainBackDrop').toggle()
            $(".settingsModal").toggle()

            if (document.querySelector(".settingsModal").style.display = "block") {
                openedPanels = ".settingsModal"
            } else {
                openedPanels = ''
            }
        },
        toggleTheme: () => {
            var lastTheme = window.localStorage.getItem("theme") || "light";

            if (lastTheme == "light") {
                window.localStorage.setItem("theme", "dark")

                root.style.setProperty("--appInner", "#18191a")
                root.style.setProperty("--title", "white")
                root.style.setProperty("--navLink", "white")
                root.style.setProperty("--sidebar", "rgb(49, 49, 49)")
                root.style.setProperty("--cmds", "white")
                root.style.setProperty("--widBorder", "#2a2a2a")
                root.style.setProperty("--tabsclr", "white")
                root.style.setProperty("--thm-wid", "#242526")
                root.style.setProperty("--someTexts", "rgb(39, 44, 55)")
                root.style.setProperty("--card-btn", "rgb(49, 49, 49)")
                root.style.setProperty("--backDrop", "#0b0b0bcc")
                root.style.setProperty("--shadow", "0 12px 28px 0 #00000033, 0 2px 4px 0 #0000001a, inset 0 0 0 1px #ffffff0d")
                root.style.setProperty("--active", "#4e4e4e")

                document.querySelector(".darkCheck").className += " checked"

            } else {
                window.localStorage.setItem("theme", "light")

                root.style.setProperty("--appInner", "#f0f2f5")
                root.style.setProperty("--title", "black")
                root.style.setProperty("--navLink", "rgb(103, 111, 128)")
                root.style.setProperty("--sidebar", "white")
                root.style.setProperty("--cmds", "black")
                root.style.setProperty("--widBorder", "#d2d2d2")
                root.style.setProperty("--tabsclr", "black")
                root.style.setProperty("--thm-wid", "white")

                root.style.setProperty("--someTexts", "white")
                root.style.setProperty("--card-btn", "#f3f3f3")
                root.style.setProperty("--backDrop", "#f4f4f4cc")
                root.style.setProperty("--shadow", "0 12px 28px 0 #00000033, 0 2px 4px 0 #0000001a, inset 0 0 0 1px #ffffff80")
                root.style.setProperty("--active", "#d2d2d2")

                document.querySelector(".darkCheck").classList.remove("checked")
            }
        }
    }
})

var sideBar = new River({
    el: '.sidebar',
    data: {
        icon: 'device_hub'
    },
    methods: {
        toggleDevices: () => {
            var container = document.querySelector('.devicesContainer')
            var backDrop = document.querySelector('.backDrop')

            if (container.style.width == '0px' || !container.style.width) {
                this.icon = 'chevron_left'
                backDrop.style.opacity = 1;
                container.style.width = '300px';
                backDrop.style.display = 'block'
                container.style.opacity = 1;
                openedPanels = container;
                sideBar.icon = 'arrow_back'
            } else {
                container.style.width = '0px'
                container.style.opacity = 0;
                backDrop.style.opacity = 0;
                backDrop.style.display = 'none'
                openedPanels = '';
                sideBar.icon = 'device_hub'
            }
        },

        deviceInfo() {

        },

    }
})
var fds = []
async function loadPROPS(dev) {
    var devID = $(dev).children('.iQYOlv').children('.devID').val()
    var mnam = document.querySelector(".mname")
    var dn = document.querySelector("#tdname")
    var did = document.querySelector("#tdid")
    var dtmpl = document.querySelector("#ttempl")
    document.querySelector(".rst-btn").setAttribute("data-dev", devID)
    document.querySelector(".stp-btn").setAttribute("data-dev", devID)
    document.querySelector(".str-btn").setAttribute("data-dev", devID)

    document.querySelector(".updt-btn").setAttribute("data-dev", devID)
    document.querySelector(".ios-btn").setAttribute("data-dev", devID)
    document.querySelector(".ior-btn").setAttribute("data-dev", devID)
    document.querySelector(".fs-btn").setAttribute("data-dev", devID)


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var props = JSON.parse(xhttp.responseText)
            loadFeeds(devID)

            mnam.innerHTML = props[0].dName;
            dn.innerHTML = props[0].dName;
            if (props[0].deviceID.split("_")[0] == 'virtual') {
                did.innerHTML = "VIRTUAL DEVICE"
            } else {
                did.innerHTML = props[0].deviceID;
            }
            dtmpl.innerHTML = props[0].template

            fds = []

        }
    };
    xhttp.open("GET", "https://iotine.zapto.org:3002/devProps/" + user + "/" + devID, true);
    await xhttp.send();
    $(".devPROPERTIES").toggle()

}
async function loadFeeds(dev) {
    var tfds = document.querySelector(".tFeeds")
    $(".tFeeds").html('<tr><th>FEEDS</th></tr><tr><th>NAME</th><th>UNIT</th></tr>')
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var feeds = JSON.parse(xhttp.responseText)
            feeds.forEach(feed => {
                var schm = {
                    name: feed.name,
                    unit: feed.unit
                }
                fds.push(schm)
                if (feeds.length != 0) {
                    var row = tfds.insertRow(tfds.length);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    cell1.innerHTML = feed.name;
                    cell2.innerHTML = feed.unit;
                } else {
                    var row = tfds.insertRow(tfds.length);
                    var cell1 = row.insertCell(0);
                    cell1.innerHTML = "NO FEEDS FOUND";
                }
            })
            return fds
        }
    };
    xhttp.open("GET", "https://iotine.zapto.org:3002/feeds/" + user + "/" + dev, true);
    await xhttp.send();
}

async function histloadFeeds(elm) {
    var dev = elm.value.split("@")[1]

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var feeds = JSON.parse(xhttp.responseText)

            $(".histfeedsList").show().empty()
            feeds.forEach(feed => {
                if (feeds.length == 0) return $(".histfeedsList").append(`<option value="none">NO FEEDS FOUND</option>`)
                $(".histfeedsList").append(`<option value="histFeed@${feed.name}">${feed.name}</option>`)
            })
            return fds
        }
    };
    xhttp.open("GET", "https://iotine.zapto.org:3002/feeds/" + user + "/" + dev, true);
    await xhttp.send();
}

function rstDev(elm) {
    var device = elm.getAttribute("data-dev")
    socket.emit('publish', {
        deviceId: device,
        feed: "$SYS/COMMANDS",
        value: "RST",
        time: new Date().toLocaleTimeString()
    })
    $("#" + device).parent().prev().children().attr(
        "src",
        "https://pro-icons-avatars.s3.amazonaws.com/icons/0.png?v=1")
    $("#" + device).parent().prev().children().attr(
        "title",
        "REBOOTING")
}

function stpDev(elm) {
    var device = elm.getAttribute("data-dev")
    socket.emit('publish', {
        deviceId: device,
        feed: "$SYS/COMMANDS",
        value: "PUB_STOP",
        time: new Date().toLocaleTimeString()
    })
    $("#" + device).parent().prev().children().attr(
        "src",
        "https://pro-icons-avatars.s3.amazonaws.com/icons/0.png?v=1")
    $("#" + device).parent().prev().children().attr(
        "title",
        "REBOOTING")
}

function strDev(elm) {
    var device = elm.getAttribute("data-dev")
    socket.emit('publish', {
        deviceId: device,
        feed: "$SYS/COMMANDS",
        value: "PUB_START",
        time: new Date().toLocaleTimeString()
    })
    $("#" + device).parent().prev().children().attr(
        "src",
        "https://pro-icons-avatars.s3.amazonaws.com/icons/0.png?v=1")
    $("#" + device).parent().prev().children().attr(
        "title",
        "REBOOTING")
}

function ioState(elm) {
    var device = elm.getAttribute("data-dev");
    socket.emit('publish', {
        deviceId: device,
        feed: "$SYS/COMMANDS/IO_STATE",
        value: prompt("IO NUMBER"),
        time: new Date().toLocaleTimeString()
    })
    $("#" + device).parent().prev().children().attr(
        "src",
        "https://pro-icons-avatars.s3.amazonaws.com/icons/0.png?v=1")
    $("#" + device).parent().prev().children().attr(
        "title",
        "REBOOTING")
}

function ioRead(elm) {
    var device = elm.getAttribute("data-dev");
    socket.emit('publish', {
        deviceId: device,
        feed: "$SYS/COMMANDS",
        value: "IO_READ/" + prompt("IO NUMBER"),
        time: new Date().toLocaleTimeString()
    })
    $("#" + device).parent().prev().children().attr(
        "src",
        "https://pro-icons-avatars.s3.amazonaws.com/icons/0.png?v=1")
    $("#" + device).parent().prev().children().attr(
        "title",
        "REBOOTING")
}

function devFiles(elm) {
    var device = elm.getAttribute("data-dev");
    $(".fsModal").toggle();
    $(".devFiles").html($("#fsys_" + device).val())
}

function newFileDev(elm) {
    var device = elm.getAttribute("data-dev");
    socket.emit('publish', {
        deviceId: device,
        feed: "$SYS/COMMANDS/NEWFILE",
        value: document.querySelector("#furl").value,
        time: new Date().toLocaleTimeString()
    })
    $("#" + device).parent().prev().children().attr(
        "src",
        "https://pro-icons-avatars.s3.amazonaws.com/icons/0.png?v=1")
    $("#" + device).parent().prev().children().attr(
        "title",
        "REBOOTING")
}

function getFileSystem(elm) {
    var device = elm.getAttribute("data-dev");
    socket.emit('publish', {
        deviceId: device,
        feed: "$SYS/COMMANDS/LISTDIR",
        value: '',
        time: new Date().toLocaleTimeString()
    })
    console.log("asking...")
    $("#" + device).parent().prev().children().attr(
        "src",
        "https://pro-icons-avatars.s3.amazonaws.com/icons/0.png?v=1")
    $("#" + device).parent().prev().children().attr(
        "title",
        "REBOOTING")
}

function updtDev(elm) {
    var device = elm.getAttribute("data-dev");
    socket.emit('publish', {
        deviceId: device,
        feed: "$SYS/COMMANDS/UPDATE",
        value: '',
        time: new Date().toLocaleTimeString()
    })
    $("#" + device).parent().prev().children().attr(
        "src",
        "https://pro-icons-avatars.s3.amazonaws.com/icons/0.png?v=1")
    $("#" + device).parent().prev().children().attr(
        "title",
        "REBOOTING")
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
var devices = new River({
    el: '.devicesList',
    data: {
        devices: []
    }
})

var histdevices = new River({
    el: '.histdevicesList',
    data: {
        devices: []
    }
})

var searchForm = new River({
    el: '.searchForm',
    data: {
        searchedDevice: ''
    },
    methods: {
        searchInList() {
            if (this.searchedDevice == '') return $('.rvBkA').show()
            devices.devices.forEach(device => {
                var res = device.name.search(this.searchedDevice)
                if (res != -1) {
                    $('#' + this.searchedDevice).hide()
                    var matches = document.getElementsByClassName("rvBkA")
                    for (i = 0; i < matches.length; i++) {
                        var id = matches[i].id.search()
                        if (id != -1) {
                            $('#' + matches[i].id).show()
                            if (matches[i].id != this.searchedDevice) {
                                $('#' + matches[i].id).hide()
                            } else {
                                $('#' + matches[i].id).show()
                            }
                        }
                    }
                }
            })
        }
    }
})

var deviceActions = new River({
    el: '.actions',
    methods: {
        newDev() {
            sideBar.toggleDevices()
            $("#dTemplate").html('<option id="null_temp" value="">Select Template</option><option v-on:click="addTemplate" value="CNT"><a href="#" style="color:blue;">+ Create new template</a></option>')
            newdevice.getTemplates();
            newdevice.connstring = "_"+makeid(32)
            document.querySelector("#Deviceurl").value = newdevice.connstring
            $('.mainBackDrop').toggle()
            $(".newDeviceModal").toggle()
            openedPanels = '.newDeviceModal'
        }
    }
})

var typ;

function step2(typ) {

    var certs = document.querySelector(".certform");
    if (typ == 'virt') {
        typ = 'virt'
        document.querySelector("#Deviceurl").value = "virtual_" + document.querySelector("#Deviceurl").value
        $(".url").hide()
        $(".forReal").hide();
        $(".finalBtn").show()
    } else {
        typ = 'real'
        document.querySelector("#Deviceurl").value = '_' + makeid(32)
        $(".url").show()

        $(".forReal").show();
        $(".finalBtn").hide()
    }
    certs.action += document.querySelector("#Deviceurl").value
    $(".step1").toggle()
    $(".step2").toggle()
}

function step3() {
    if (typ == 'virt') {
        document.querySelector("#Deviceurl").value = "virtual_" + document.querySelector("#Deviceurl").value
        $(".url").hide()
    } else {
        document.querySelector("#Deviceurl").value = '_' + makeid(32)
        $(".url").show()
    }
    $(".step2").toggle()
    $(".step3").toggle()
}

function step4() {

    $(".step3").hide()
    $(".certform").show()
}

function uploadCert() {
    var x = document.getElementById("userCerts");

    if ('files' in x) {
        if (x.files.length < 1) {
            alert("You are missing some files.");
            return false;
        } else if (x.files.length > 1) {
            alert("Remove any extra file you uploaded.")
            return false;
        } else {
            for (var i = 0; i < x.files.length; i++) {
                var file = x.files[i];
                newdevice.addDevice()
                return true
            }
        }
    }


}

var newdevice = new River({
    el: '.newDeviceModal',
    data: {
        connstring: makeid(32)
    },
    methods: {
        addDevice() {
            var certs = document.querySelector(".certform");
            certs = certs.action.split("/")
            devices.devices.push({
                name: document.getElementById('Devicename').value,
                type: document.querySelector("#dTemplate").value,
                deviceID: certs[certs.length - 1]
            })
            histdevices.devices.push({
                name: document.getElementById('Devicename').value,
                type: document.querySelector("#dTemplate").value,
                deviceID: certs[certs.length - 1]
            })

            saveDevice(document.getElementById('Devicename').value, document.querySelector("#dTemplate")
                .value, certs[certs.length - 1])
            $('.mainBackDrop').toggle()
            $(".newDeviceModal").toggle()
            openedPanels = ''
            sideBar.toggleDevices()
        },
        async getTemplates() {
            var tempList = $("#null_temp")
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    // Typical action to be performed when the document is ready:
                    templates = JSON.parse(xhttp.responseText);
                    if (templates.length != 0) {
                        templates.forEach(template => {
                            var opt = document.createElement('option');
                            opt.value = template.name;
                            opt.innerHTML = template.name;

                            tempList.after(opt)
                        })
                    } else {
                        return
                    }
                }
            };
            xhttp.open("GET", "https://iotine.zapto.org:3002/templates/" + user, true);
            await xhttp.send();
        },
        async addTemplate() {
            if (document.querySelector("#dTemplate").value != "CNT") return
            confirm("Do you want to make a new Template?")
            var name = prompt("Template name :")

            var newopt = document.createElement('option')

            document.querySelector("#dTemplate").appendChild(newopt)
            newopt.innerHTML = name
            newopt.value = name;
            document.querySelector("#dTemplate").value = name;

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    // Typical action to be performed when the document is ready:
                    console.log("%c TEMPLATE HAS BEEN SAVED.", "color:palegreen;")
                }
            };
            xhttp.open("POST", "https://iotine.zapto.org:3002/newTempl/" + user + "/" + name, true);
            await xhttp.send();
        },


    }
})

function addvDevice() {
    var certs = document.querySelector(".certform");
    certs = certs.action.split("/")
    devices.devices.push({
        name: document.getElementById('Devicename').value,
        type: document.querySelector("#dTemplate").value,
        deviceID: certs[certs.length - 1]
    })
    histdevices.devices.push({
        name: document.getElementById('Devicename').value,
        type: document.querySelector("#dTemplate").value,
        deviceID: certs[certs.length - 1]
    })

    savevDevice(document.getElementById('Devicename').value, document.querySelector("#dTemplate")
        .value, certs[certs.length - 1])
    $('.mainBackDrop').toggle()
    $(".newDeviceModal").toggle()
    openedPanels = ''
    sideBar.toggleDevices()
}

async function saveDevice(name, templ, did) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            console.log("%c DEVICE HAS BEEN SAVED.", "color:palegreen;")
        }
    };
    xhttp.open("POST", "https://iotine.zapto.org:3002/newDevice/" + user + "/" + name + "/" + did + "/" +
        templ, true);
    await xhttp.send();
}

async function savevDevice(name, templ, did) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            console.log("%c DEVICE HAS BEEN SAVED.", "color:palegreen;")
        }
    };
    xhttp.open("GET", "https://iotine.zapto.org:3002/virtualDevice/" + user + "/" + name + "/" + templ + "/" + did, true);
    await xhttp.send();
}

var newAppModal = new River({
    el: '.form',
    data: {
        newAppName: ''
    },
    methods: {
        addDevice() {
            Apps.items.push({
                name: document.getElementById('appname').value,
                id: document.getElementById('appname').value.replace(" ", "_").toLowerCase(),
                url: document.getElementById('appurl').value.replace(" ", "_").toLowerCase() +
                    '.divyanshg809.iotine.com'
            })
            $('.newAppModal').toggle();
            $('.mainBackDrop').toggle()
            openedPanels = '.newAppModal'
        }
    }
})
var backDrop = new River({
    el: '.backDrop',
    methods: {
        hideOpenedPanel() {
            sideBar.toggleDevices()
            backDrop.style.opacity = 0;
            backDrop.style.display = 'none'
        }
    }
})

const newApp = () => {
    $(".mainBackDrop").toggle()
    $(".newAppModal").toggle()
    openedPanels = '.newAppModal'
}

const hideAll = () => {
    $(".mainBackDrop").toggle()
    $(openedPanels).toggle()
}

const openMore = elm => {
    $('#drop_' + elm).toggle().css({
        'top': '45px',
        'margin-left': '5px'
    })
    //console.log(document.getElementById('drop_'+elm).className = 'open')
    //$("#"+elm).closest(".toggle").siblings(".dash-dropdown").classList += 'open';
}


function loadLink(lnk, elm) {
    if (lnk == '/apps') {
        $("#appInner").hide()
        linkactive(elm)
    } else {

        $('#appInner').load(lnk, function () {
            linkactive(elm)
            $("#appInner").show()
            //$(".content-new").show()
            //var modal = document.getElementById("preld");
            //var modalC = document.querySelector(".preld");
            //modal.style.display = "block";
            //$(".mainBody").hide()
            //setTimeout('$("#preld").hide()', 500);
        });
    }
}


getUser();
var user;
var app = window.location.pathname.split("/")[3];
var socket = io('iotine.zapto.org:3000/', {
    secure: true,
    rejectUnauthorized: false
});
async function getUser() {
    var username = localStorage["currentLoggedInUser"];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            user = xhttp.responseText;

            socket.emit("JoinTheMess", user)
            getDevices()
            createTabs()
        }
    };
    xhttp.open("GET", "https://iotine.zapto.org:3002/user/" + username, true);
    await xhttp.send();
}

document.querySelector(".wlcm").innerHTML += localStorage["currentLoggedInUser"]

async function getDevices() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var resdevice = JSON.parse(xhttp.responseText)
            resdevice.forEach(device => {
                var dname;
                if (device.deviceID.split("_")[0] == "virtual") {
                    dname = device.dName + " (virtual)"
                    devices.devices.push({
                        name: dname,
                        type: device.template,
                        deviceID: device.deviceID,
                        version: "v" + device.fver,
                        fs: ''
                    })
                    histdevices.devices.push({
                        name: dname,
                        type: device.template,
                        deviceID: device.deviceID,
                        version: "v" + device.fver,
                        fs: ''
                    })
                    $("#" + device.deviceID).siblings(".cTHQrV").children(".devVer").html("v" +
                        device.version)
                } else {
                    devices.devices.push({
                        name: device.dName,
                        type: device.template,
                        deviceID: device.deviceID,
                        version: "v" + device.fver,
                        fs: ''
                    })
                    histdevices.devices.push({
                        name: device.dName,
                        type: device.template,
                        deviceID: device.deviceID,
                        version: "v" + device.fver,
                        fs: ''
                    })
                    $("#" + device.deviceID).siblings(".cTHQrV").children(".devVer").html("v" +
                        device.version)
                }
            })
            updateDeviceStatus()
        }
    };
    xhttp.open("GET", "https://iotine.zapto.org:3002/devices/" + user, true);
    await xhttp.send();
}


function getTabs() {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // Typical action to be performed when the document is ready:
                resolve(JSON.parse(xhttp.responseText))
            }
        };
        xhttp.open("GET", "https://iotine.zapto.org:3002/tabs/" + user + "/" + app, true);
        xhttp.send();
    })
}
/*
var widgets = [{
    name:"Fake Live",
    feed:"someVideo",
    type:"image",
    config:{
       src:"http://192.168.31.212:8080/video",
       tab:"dpkgk213"  
    }    
},{
    name:"Youtube Stream",
    feed:"",
    type:"iframe",
    config:{
        src: "https://www.youtube.com/embed/C6CNvG89FcQ",
        tab: "dpkgk213"
    }
},{
    name:"retg54 log",
    feed:"retg54",
    type:"log",
    config:{
        color: "#00b10f",
        device:"qwerty12",
        tab:"dpkgk213"
    }    
}]
*/

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
var feeds = []

function lineChart(id, config, widgetBdy, prev) {
    var chartContainer;
    if (prev == "") {
        chartContainer = document.createElement("canvas");
        chartContainer.className += "chart chartjs-render-monitor"
    } else {
        chartContainer = document.querySelector(".chart-" + prev)
    }

    chartContainer.className += " chart-" + id

    chartContainer.width = "325"
    chartContainer.height = "180"
    chartContainer.style.display = "block";

    var ctx = chartContainer.getContext('2d')

    ctx.fillStyle = "#a5a5a5";
    ctx.font = '15px Arial';

    var textString = "NO DATA",
        textWidth = ctx.measureText(textString).width;


    ctx.fillText(textString, (chartContainer.width / 2) - (textWidth / 2), 100);
    /*if(config.labels == ""){
        widgetBdy.innerHTML += "<p class='ndt'>not recieving any data</p>"
    }*/


    widgetBdy.appendChild(chartContainer)

    feeds.push(id)
}

function createGauge(id, config, widgetBdy) {
    var gaugeContainer = document.createElement("canvas");
    gaugeContainer.className += "chart"

    gaugeContainer.id = "gauge-" + id

    gaugeContainer.width = "325"
    gaugeContainer.height = "180"


    widgetBdy.appendChild(gaugeContainer)

    updateGauge(gaugeContainer.id, gaugeContainer.getContext('2d'), "hi", "retg54")

    feeds.push(id)
}

function createButton(id, feed, config, bdy) {
    var buttonCont = document.createElement("button")
    var btnId = "btn-" + id
    buttonCont.className += "ripple wid-btn " + "btn-" + id

    bdy.className += " btn-wid"

    buttonCont.innerHTML = config.text
    buttonCont.style.backgroundColor = config.bgcolor
    buttonCont.style.borderColor = config.borderColor
    buttonCont.style.color = config.textColor

    buttonCont.addEventListener('click', () => {
        pubii(buttonCont, feed, config)
    })

    bdy.appendChild(buttonCont)
}

function createMap(id, config, bdy) {
    var mapCont = document.createElement('img')
    mapCont.className += 'map-wid map-' + id
    mapCont.src =
        "https://media.nationalgeographic.org/assets/photos/333/793/fb1e4408-26be-4821-b667-8010401f20d6.jpg"

    bdy.className += " wid-map"

    bdy.appendChild(mapCont);
}

function createRange(feedd, feed, config, bdy) {
    var slider = document.createElement('input')
    slider.className += "slider range-" + feedd
    slider.type = "range"
    slider.min = config.minval
    slider.max = config.maxval
    slider.value = config.value

    slider.addEventListener('input', function () {
        publishRange(".range-" + feedd, feed, config)
    })

    bdy.className += " wid-range"

    bdy.appendChild(slider)
}

function createLog(feed, fedd, config, bdy) {
    var logCont = document.createElement("div")
    logCont.className += "textarea log-" + feed;
    logCont.style.color = config.color + " !important"

    logCont.innerHTML += "CONNECTED TO " + config.device + "/" + fedd + "\nWaiting For Data...\n"

    bdy.className += " wid-txt"

    bdy.appendChild(logCont)
}

function createImg(feed, config, bdy) {
    var imgCont = document.createElement("img")
    imgCont.src = config.src
    imgCont.height = "180"
    imgCont.width = "380"

    bdy.appendChild(imgCont)
}

function createVideo(feed, config, bdy) {
    var videoCont = document.createElement("video")
    videoCont.src = config.src
    videoCont.height = "180"
    videoCont.width = "380"

    bdy.appendChild(videoCont)
}

function createIFrame(feed, config, bdy) {
    var iframeCont = document.createElement("iframe")
    iframeCont.src = config.src
    iframeCont.height = "180"
    iframeCont.width = "380"
    iframeCont.gesture = "media"
    iframeCont.allow = "encrypted-media"

    bdy.appendChild(iframeCont)
}
var widgets;
var wids = [{
    name: "Servo Control",
    feed: "CORE_TEMP",
    type: "range",
    config: {
        minval: 10,
        maxval: 180,
        value: 10,
        device: "gUvSTHbQnMuUWI6HHqwiDBvdp6PKbYU4",
        tab: "ttAcbo0Ly8"
    }
}, ]
async function createWidget() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            widgets = JSON.parse(xhttp.responseText)
            if (widgets.length > 0) {
                document.querySelector("#nowid").style.display = "none"
            }
            //wids.push(wids)
            widgets.forEach(widget => {
                var widgetBdy = document.createElement('div')
                var head = document.createElement('h4');
                var latestData = document.createElement('p');

                latestData.className += " latData";
                head.className += " wid-head"
                widgetBdy.appendChild(head)
                widgetBdy.appendChild(latestData)
                head.innerHTML = widget.name;

                widgetBdy.className += 'widget';

                document.querySelector("#" + widget.config.tab).appendChild(widgetBdy)
                widgetBdy.title = document.querySelector("#" + widget.config.device).alt

                if (widget.type == "chart") {
                    var prev = ''
                    lineChart(widget.feed + "-" + widget.config.device, widget.config,
                        widgetBdy, prev)
                } else if (widget.type == "btn") {
                    createButton(widget.feed + "-" + widget.config.device, widget.feed, widget
                        .config, widgetBdy)
                } else if (widget.type == "map") {
                    createMap(widget.feed + "-" + widget.config.device, widget.feed, widget.config,
                        widgetBdy)
                } else if (widget.type == "range") {
                    createRange(widget.feed + "-" + widget.config.device, widget.feed, widget.config,
                        widgetBdy)
                } else if (widget.type == "log") {
                    createLog(widget.feed + "-" + widget.config.device, widget.feed, widget.config,
                        widgetBdy)
                } else if (widget.type == "video") {
                    createVideo(widget.feed + "-" + widget.config.device, widget.feed, widget.config,
                        widgetBdy)
                } else if (widget.type == "image") {
                    createImg(widget.feed + "-" + widget.config.device, widget.feed, widget.config,
                        widgetBdy)
                } else if (widget.type == "iframe") {
                    createIFrame(widget.feed + "-" + widget.config.device, widget.feed, widget
                        .config, widgetBdy)
                }

            })
        }
    };
    xhttp.open("GET", "https://iotine.zapto.org:3002/widgets/" + user + "/" + app, true);
    await xhttp.send();
}

function getWidget(feed, dev) {
    var obj = [];
    for (i = 0; i < widgets.length; i++) {
        if (widgets[i].feed == feed && widgets[i].config.device == dev) {
            obj.push(widgets[i])

        }
    }
    return obj
}

function updateChart(id, ctx, msg, feed) {
    var allElms = $(".chart-" + feed + "-" + msg.deviceId).show()
    for (i = 0; i < allElms.length; i++) {
        var widgets = getWidget(feed, msg.deviceId)
        for (j = 0; j < widgets.length; j++) {
            widget = widgets[j]
            try {
                ctx = allElms[j].getContext('2d')
            } catch (e) {
                return
            }
            //console.log(/\d/.test(msg.value))
            var config = widgets[j].config

            widgets[j].datasets[0].data.push(msg.value)

            config.labels.push(msg.time)

            var chart = new Chart(ctx, {
                type: config.type,
                data: {
                    labels: config.labels,
                    datasets: widgets[j].datasets
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    animation: true,
                    autoSkip: false,
                    legend: {
                        display: true
                    },
                    tooltips: {
                        enabled: true
                    }
                }
            });

            if (widgets[j].datasets[0].data.length >= parseInt(config.dataPoints)) {
                widgets[j].datasets[0].data.shift()
                config.labels.shift()
                //$(".ndt").remove()
                chart.update()
            } else {
                //$(".ndt").remove()
                chart.update()
            }
        }
    }

}

function updateButton(classname, msg, feed) {
    var btn = document.querySelector("." + classname)
    for (i = 0; i < widgets.length; i++) {
        var widget = widgets[i]
        var config = widget.config
        if (widget.type == "button") {
            if (msg.value == "ON") {
                config.text = "ON"
                config.changeText = "OFF"
                btn.innerHTML = msg.value
            } else if (msg.value == "OFF") {
                config.text = "OFF"
                config.changeText = "ON"
                btn.innerHTML = msg.value
            }
        }
    }
}

function updateGauge(id, ctx, msg, feed) {
    var myPieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["yo", ""],
            datasets: [{
                label: "jii",
                data: [30, 70],
                backgroundColor: ["red", "black"],
                borderColor: ["red", "black"],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            },
            animation: false,
            autoSkip: false
        }
    });
}

function updateRange(id, msg, feed) {
    var range = document.querySelector(id) || false;

    if (!range) return

    range.value = msg;
}

function updateLog(id, msg, feed) {
    var logCont = document.querySelector(id) || false;
    if (!logCont) return
    var cont = logCont.parentNode
    logCont.innerHTML += msg.time + " : Message Recieved " + msg.value + "\n"
    cont.scrollTop = cont.scrollHeight - cont.clientHeight
}
socket.on('subscribe', (feed, msg, unit) => {
    if (unit != "DIRS") {
        feeds.forEach(mfeed => {
            if (mfeed == feed + "-" + msg.deviceId) {

                updateButton("btn-" + feed + "-" + msg.deviceId, msg, feed)
                updateLog(".log-" + feed + "-" + msg.deviceId, msg, feed)
                var chart = document.querySelector(".chart-" + feed + "-" + msg.deviceId)
                var latestData = chart.previousSibling
                latestData.innerHTML = msg.value + " " + unit
                var ctx = chart.getContext("2d")
                updateChart("chart-" + feed + "-" + msg.deviceId, ctx, msg, feed)

                var range = document.querySelector(".range-" + feed + "-" + msg.deviceId) ||
                    false
                if (!range) return
                var latestData = range.previousSibling
                latestData.innerHTML = msg.value + " " + unit
                updateRange(".range-" + feed + "-" + msg.deviceId, msg.value, feed)
            } else {
                return
            }
        })
    }
});

function publishRange(id, feed, config) {
    var slider = document.querySelector(id)
    socket.emit('publish', {
        user: user,
        deviceId: config.device,
        feed: feed,
        value: slider.value,
        time: new Date().toLocaleTimeString()
    })
    var latestData = slider.previousSibling
    latestData.innerHTML = slider.value
    updateRange(".range-" + feed, slider.value, feed)
}

function pubii(id, feed, config) {
    if (config.text == "ON") {
        socket.emit('publish', {
            user: user,
            deviceId: config.device,
            feed: feed,
            value: "OFF",
            time: new Date().toLocaleTimeString()
        })

        config.text = "OFF"
        config.changeText = "ON"

        id.innerHTML = "OFF";

        return

    } else if (config.text == "OFF") {
        socket.emit('publish', {
            user: user,
            deviceId: config.device,
            feed: feed,
            value: "ON",
            time: new Date().toLocaleTimeString()
        })

        config.text = "ON"
        config.changeText = "OFF"

        id.innerHTML = "ON"
    }
}

async function updateDeviceStatus() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var devs = JSON.parse(xhttp.responseText)
            devs.forEach(dev => {
                if (dev.status == "ONLINE") {
                    $("#" + dev.deviceID).parent().prev().children().attr("src",
                        "https://pro-icons-avatars.s3.amazonaws.com/icons/9.png?v=1"
                    )
                    $("#" + dev.deviceID).parent().prev().children().attr("title", dev
                        .status)
                } else if (dev.status == "IDLE") {
                    $("#" + dev.deviceID).parent().prev().children().attr("src",
                        "https://pro-icons-avatars.s3.amazonaws.com/icons/4.png?v=1"
                    )
                    $("#" + dev.deviceID).parent().prev().children().attr("title", dev
                        .status)
                } else {
                    $("#" + dev.deviceID).parent().prev().children().attr("src",
                        "https://pro-icons-avatars.s3.amazonaws.com/icons/10.png?v=1"
                    )
                    $("#" + dev.deviceID).parent().prev().children().attr("title", dev
                        .status)
                }
            })
        }
    };
    xhttp.open("GET", "https://iotine.zapto.org:3002/deviceState/" + user, true);
    await xhttp.send()
}


function openTab(evt, id) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.querySelector("#" + id).style.display = "block";
    evt.currentTarget.className += " active";
}

function addClicks() {
    var tabLink = document.getElementsByClassName("tablinks");
    for (i = 0; i < tabLink.length; i++) {
        tabLink[i].addEventListener('click', function () {
            openTab(event, this.classList[1])
        })
    }
}

function createTabs() {
    getTabs().then(tabs => {
        for (var i = 0; i < tabs.length; i++) {
            var tabbar = document.querySelector(".tab")
            var tabLink = document.createElement("button")
            var tabCont = document.createElement("div")

            tabLink.className += "tablinks"
            tabCont.className += "tabcontent"


            var tab = tabs[i]
            tabLink.innerHTML = tab.name


            tabLink.className += " " + tab.tabId

            tabCont.id = tab.tabId

            tabbar.appendChild(tabLink)

            var dash = document.querySelector(".maindash")
            dash.appendChild(tabCont)


            if (i == 0) {
                tabCont.style.display = "block"
                tabLink.className += " active"
            }
        }

        addClicks()
        createWidget()
    })
}

function toggleNav() {
    var nav = document.querySelector(".diMILA")
    if (nav.style.display == "block" || !nav.style.display) {
        nav.style.display = "none";
        $("#dehaze").html("dehaze")
        $(".mainappin").css({
            "width": "100%"
        });
    } else {
        nav.style.display = "block";
        $("#dehaze").html("clear_all")
        $(".mainappin").css({
            "width": "calc(100% - 230px)"
        });
    }
}

socket.on('devStat', (device, status) => {
    if (status == "ONLINE") {
        $("#" + device).parent().prev().children().attr("src",
            "https://pro-icons-avatars.s3.amazonaws.com/icons/9.png?v=1")
        $("#" + device).parent().prev().children().attr("title", status)
    } else if (status == "IDLE") {
        $("#" + device).parent().prev().children().attr("src",
            "https://pro-icons-avatars.s3.amazonaws.com/icons/4.png?v=1")
        $("#" + device).parent().prev().children().attr("title", status)
    } else {
        $("#" + device).parent().prev().children().attr("src",
            "https://pro-icons-avatars.s3.amazonaws.com/icons/10.png?v=1")
        $("#" + device).parent().prev().children().attr("title", status)
    }
})

socket.on('FSYS', (fsys, device) => {
    $("#fsys_" + device).val(fsys)
})

socket.on('DEV_VERSION', (msg) => {
    devices.devices.forEach(device => {
        if (device.deviceID == msg.device) {
            device.version = msg.version
            $("#" + msg.device).siblings(".cTHQrV").children(".devVer").html("v" + msg
                .version)
        } else {
            return
        }
    })
})

function loadHistory() {

}