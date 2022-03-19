const globalServerName = "https://heatmap.z08tech.com";
const globalShopName = localStorage.getItem("shop-name");

var jQueryScript = document.createElement("script");
jQueryScript.setAttribute(
  "src",
  "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"
);
getUserActivity();

window.addEventListener("load", (event) => {
  console.log("-------------------PAGE IS FULLY LOADED --------------");

  console.log(sessionStorage.getItem("StartTime"));

  if (!sessionStorage.getItem("StartTime")) {
    console.log("entered once");
    sessionStorage.setItem("StartTime", startDate.getTime());

    console.log(sessionStorage.getItem("StartTime"));
  }
});

let startDate = new Date();
var pg_url = window.location.href;
console.log(pg_url);
let elapsedTime = 0;

// const focus = function () {
//   startDate = new Date();
// };

const beforeunload = function () {
  localStorage.removeItem("StartTime");
  const endDate = new Date();
  //   const spentTime = endDate.getTime() - startDate.getTime();
  const spentTime =
    endDate.getTime() - sessionStorage.getItem("StartTime").getTime();
  elapsedTime += spentTime;
  console.log(elapsedTime);
};

// const blur = function () {
//   const endDate = new Date();
//   const spentTime = endDate.getTime() - startDate.getTime();
//   elapsedTime += spentTime;
//   console.log(elapsedTime);
// };

// elapsedTime contains the time spent on page in milliseconds

// const unload = function(){
// 	 localStorage.removeItem("RecordingID");
// }

window.addEventListener("focus", focus);
window.addEventListener("blur", blur);
window.addEventListener("beforeunload", beforeunload);

const getTimeStamp = () => {
  const currentDate = new Date();
  console.log(currentDate);
};
getTimeStamp();

function getBrowser() {
  var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

  // Firefox 1.0+
  var isFirefox = typeof InstallTrigger !== 'undefined';

  // Safari 3.0+ "[object HTMLElementConstructor]" 
  var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/false || !!document.documentMode;

  // Edge 20+
  var isEdge = !isIE && !!window.StyleMedia;

  // Chrome 1 - 79
  var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  // Edge (based on chromium) detection
  var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

  let browser = ""

  if(isFirefox) browser = "Mozilla Firefox"
  if(isChrome) browser = "Google Chrome"
  if(isSafari) browser = "Apple Safari"
  if(isOpera) browser = "Opera"
  if(isIE) browser = "Internet Explorer"
  if(isEdge) browser = "Microsoft Edge"
  if(isEdgeChromium) browser = "Microsoft Edge"

  return browser;
}

function getOS() {
  var Name = "Not known";
  if (navigator.appVersion.indexOf("Win") != -1) Name = "Windows OS";
  if (navigator.appVersion.indexOf("Mac") != -1) Name = "MacOS";
  if (navigator.appVersion.indexOf("X11") != -1) Name = "UNIX OS";
  if (navigator.appVersion.indexOf("Linux") != -1) Name = "Linux OS";
  console.log(Name);
  return Name;
}

function deviceType() {
  const ua = navigator.userAgent;
  console.log(ua);
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    console.log("tablet");
    return "tablet";
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    console.log("mobile");
    return "mobile";
  }
  console.log("desktop");
  return "desktop";
}

var xhr = new XMLHttpRequest();
xhr.open(
  "GET",
  "https://api.countapi.xyz/hit/heat-map-pj.myshopify.com/visits"
);
xhr.responseType = "json";
xhr.onload = function () {
  console.log("visitors count:- " + this.response.value);
};
xhr.send();

var events = [];
function getUserActivity() {
  var jQueryScript1 = document.createElement("link");
  jQueryScript1.setAttribute(
    "href",
    "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.css"
  );
  document.head.appendChild(jQueryScript1);
  var jQueryScript2 = document.createElement("script");
  jQueryScript2.setAttribute(
    "src",
    "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.js"
  );
  document.head.appendChild(jQueryScript2);
  var jQueryScript3 = document.createElement("link");
  jQueryScript3.setAttribute(
    "href",
    "https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.css"
  );
  document.head.appendChild(jQueryScript3);
  var jQueryScript4 = document.createElement("link");
  jQueryScript4.setAttribute(
    "href",
    "https://cdn.jsdelivr.net/npm/rrweb-player@latest/dist/style.css"
  );
  document.head.appendChild(jQueryScript4);
  var jQueryScript5 = document.createElement("script");
  jQueryScript5.setAttribute(
    "src",
    "https://cdn.jsdelivr.net/npm/rrweb-player@latest/dist/index.js"
  );
  document.head.appendChild(jQueryScript5);
}

// setTimeout(function () {
//   console.log(events);
// }, 2000);


function getCurrentPath() {
  const path = window.location.pathname.split("/")[1];
  if (path === "") {
    console.log("Home");
  } else {
    console.log(path);
  }

  return path;
}

//Post Requests for above functions
setTimeout(function () {
  rrweb.record({
    emit(event) {
      // push event into the events array
      events.push(event);
    },
  });
}, 1000);
// getUserActivity();
var browser = getBrowser();
var os = getOS();
var path = getCurrentPath();
var device = deviceType();
// window.onbeforeunload = function () {
//   postData();
// };

// postData();

async function postData() {
  const sessionId = localStorage.getItem("SessionID");
  console.log(sessionId);

  if (!sessionId) {
    getSessionId();
    console.log(sessionId, "inside postData");
  }
  const data = {
    browser: browser,
    osInfo: os,
    path: path,
    recording: null,
    userActivity: null,
    sessionId: sessionId,
    pgurl: [],
    // activity: JSON.stringify({ events }),
  };
  data.pgurl.push(pg_url);
  console.log(data, "this is data");

  axios
    .post(
      `${globalServerName}/shop/add-user-session-info?shop=${globalShopName}`,

      data
    )
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log("err", err);
    });
}

setTimeout(function () {
  //     console.log(events);
  postData();
}, 2000);

let startTime = 0;

window.onload = function () {
  startTime = new Date().getTime();
};

async function getRecId() {
  axios
    .get(`${globalServerName}/shop/recording-id?shop=${globalShopName}`)
    .then((res) => {
      //       localStorage.setItem("RecordingID", res.data);
      sessionStorage.setItem("RecordingID", res.data);
    })
    .catch((err) => {
      console.log("err", err);
    });
}

async function getSessionId() {
  axios
    .get(`${globalServerName}/shop/session-id?shop=${globalShopName}`)
    .then((res) => {
      localStorage.setItem("SessionID", res.data);
    })
    .catch((err) => {
      console.log("err", err);
    });
}

async function postActivity() {
  //    const recordingId = localStorage.getItem("RecordingID");
  const recordingId = sessionStorage.getItem("RecordingID");
  const sessionId = localStorage.getItem("SessionID");

  const endDate = new Date();
  //   const spentTime = endDate.getTime() - startDate.getTime();
  const spentTime = endDate.getTime() - sessionStorage.getItem("StartTime");

  console.log(spentTime);
  console.log(recordingId, sessionId);

  if (!recordingId) {
    getRecId();
  }

  if (!sessionId) {
    getSessionId();
  }

  const data = {
    id: recordingId,
    sessionId: sessionId,
    timeDuration: spentTime,
    recording: JSON.stringify({ events }),
  };
  // let newData = pako.deflate(JSON.stringify(data), { to: "string" });
  // console.log("events ", { data: newData });
  // console.info(new Blob([JSON.stringify(data)]).size / 1024 / 1024);
  // console.info(new Blob([newData]).size / 1024 / 1024);
  console.log("events ", events);
  axios
    .post(
      `${globalServerName}/shop/send-recording?shop=${globalShopName}`,
      data,
      {
        maxContentLength: 100000000,
        maxBodyLength: 1000000000,
      }
    )
    .then((data) => {
      console.log(data);
      events = [];
    })
    .catch((err) => {
      console.log("err", err);
    });
}

setInterval(function () {
  postActivity();
}, 5000);

window.onbeforeunload = function () {
  postActivity();
  localStorage.removeItem("RecordingID");
  localStorage.removeItem("StartTime");
};
