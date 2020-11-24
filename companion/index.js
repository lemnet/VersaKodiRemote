import * as messaging from "messaging";
import { settingsStorage } from "settings";

let ip = "";
let port = "";
let login = "";
let pass = "";
let muted = false;
let playerid = 0;

messaging.peerSocket.addEventListener("message", (evt) => {
  if (evt.data && evt.data.command === "checkConfig")
    checkConfig();
  else if (evt.data && evt.data.command === "checkConn")
    checkConn();
  else if (evt.data && evt.data.command === "getVolume")
    getVolume();
  else if (evt.data && evt.data.command === "getPlaying")
    getPlaying();
  else if (evt.data && evt.data.command === "getMute")
    getMute();
  else if (evt.data && evt.data.command === "backw")
    seek("backward");
  else if (evt.data && evt.data.command === "play")
    play();
  else if (evt.data && evt.data.command === "forw")
    seek("forward");
  else if (evt.data && evt.data.command === "prev")
    goto("previous");
  else if (evt.data && evt.data.command === "stop")
    stop();
  else if (evt.data && evt.data.command === "next")
    goto("next");
  else if (evt.data && evt.data.command === "back")
    key("back");
  else if (evt.data && evt.data.command === "up")
    key("up");
  else if (evt.data && evt.data.command === "left")
    key("left");
  else if (evt.data && evt.data.command === "ok")
    key("select");
  else if (evt.data && evt.data.command === "right")
    key("right");
  else if (evt.data && evt.data.command === "down")
    key("down");
  else if (evt.data && evt.data.command === "party")
    party();
  else if (evt.data && evt.data.command === "volmin")
    vol("decrement");
  else if (evt.data && evt.data.command === "mute")
    mute();
  else if (evt.data && evt.data.command === "volplus")
    vol("increment");
});

function checkConfig() {
  let ipok = false;
  let portok = false;
  let loginok = false;
  let passok = false;
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key == "ip") {
      ip = JSON.parse(settingsStorage.getItem(key))["name"];
      if (/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(ip))
        ipok = true;
    }
    if (key == "port") {
      port = JSON.parse(settingsStorage.getItem(key))["name"];
      if (/^([0-9]){1,5}$/.test(port))
        portok = true;
    }
    if (key == "login") {
      login = JSON.parse(settingsStorage.getItem(key))["name"];
      if (login != "")
        loginok = true; 
    }
    if (key == "pass") {
      pass = JSON.parse(settingsStorage.getItem(key))["name"];
      if (pass != "")
        passok = true; 
    }       
  }
  if (ipok && portok && loginok && passok) {
    let data = {
      key: "checkconfig",
      value : "ok"
    }
    sendVal(data);
  }
}

function checkConn() {
  let url = "http://" + ip +":" + port + "/jsonrpc?request=";
  fetch(url, {
    method: 'GET',
    headers: {
        "Authorization": "Basic " + btoa(login+":"+pass)
    },
    timeout: 10000
  })
  .then(function (response) {
    response.json()
    .then(function(data) {
      if (data.description == "JSON-RPC API of XBMC") {
        let data = {
          key: "checkconn",
          value : "ok"
        }
        sendVal(data);
      }
    });
  })
  .catch(function (err) {
    console.error(`Error fetching kodi: ${err}`);
  });
}

function getMute() {
  let url = "http://" + ip +":" + port + "/jsonrpc?request=" + encodeURI('{"jsonrpc": "2.0", "method": "Application.GetProperties", "params": {"properties": ["muted"]}, "id": 1}');
  fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": "Basic " + btoa(login+":"+pass)
    },
    timeout: 10000
  })
  .then(function (response) {
    response.json()
    .then(function(data) {
      muted = data.result.muted
      let data1 = {
        key: "muted",
        value : data.result.muted
      }
      sendVal(data1);
    });
  })
  .catch(function (err) {
    console.error(`Error fetching kodi: ${err}`);
  });
}

function getVolume() {
  let url = "http://" + ip +":" + port + "/jsonrpc?request=" + encodeURI('{"jsonrpc": "2.0", "method": "Application.GetProperties", "params": {"properties": ["volume"]}, "id": 1}');
  fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": "Basic " + btoa(login+":"+pass)
    },
    timeout: 10000
  })
  .then(function (response) {
    response.json()
    .then(function(data) {
      let data1 = {
        key: "volume",
        value : data.result.volume
      }
      sendVal(data1);
    });
  })
  .catch(function (err) {
    console.error(`Error fetching kodi: ${err}`);
  });
}

function getPlaying() {
  let url = "http://" + ip +":" + port + "/jsonrpc?request=" + encodeURI('{"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id":1}');
  fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": "Basic " + btoa(login+":"+pass)
    },
    timeout: 10000
  })
  .then(function (response) {
    response.json()
    .then(function(data) {
      if (data["result"].length == 0) {
        let data1 = {
          key: "playing",
          value : "--"
        }
        sendVal(data1);
      }
      else {
        if (data.result["0"].type == "audio" || data.result["0"].type == "video") {
          playerid = data.result["0"].playerid;
          let url = "http://" + ip +":" + port + "/jsonrpc?request=" + encodeURI('{"jsonrpc": "2.0", "method": "Player.GetItem", "id":1, "params": { "playerid": ') + data.result["0"].playerid + encodeURI('}}');
          fetch(url, {
            method: 'GET',
            headers: {
              "Authorization": "Basic " + btoa(login+":"+pass)
            },
            timeout: 10000
          })
          .then(function (response) {
            response.json()
            .then(function(data) {
              let data1 = {
                key: "playing",
                value : data.result.item.label
              }
              sendVal(data1);
            })
          })
        }
      }
    });
  })
  .catch(function (err) {
    console.error(`Error fetching kodi: ${err}`);
  });
}

function seek(param) {
  let url = "http://" + ip +":" + port + "/jsonrpc?request=" + encodeURI('{"jsonrpc": "2.0", "method": "Player.Seek", "id":1, "params": { "playerid": ') + playerid + encodeURI(',"value":"small') + param + encodeURI('"}}');
  fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": "Basic " + btoa(login+":"+pass)
    },
    timeout: 10000
  })
  .catch(function (err) {
    console.error(`Error fetching kodi: ${err}`);
  });
}

function play() {
  let url = "http://" + ip +":" + port + "/jsonrpc?request=" + encodeURI('{"jsonrpc": "2.0", "method": "Player.PlayPause", "id":1, "params": { "playerid": ') + playerid + encodeURI('}}');
  fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": "Basic " + btoa(login+":"+pass)
    },
    timeout: 10000
  })
  .catch(function (err) {
    console.error(`Error fetching kodi: ${err}`);
  });
}

function goto(param) {
  let url = "http://" + ip +":" + port + "/jsonrpc?request=" + encodeURI('{"jsonrpc": "2.0", "method": "Player.GoTo", "id":1, "params": { "playerid": ') + playerid + encodeURI(',"to":"') + param + encodeURI('"}}');
  fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": "Basic " + btoa(login+":"+pass)
    },
    timeout: 10000
  })
  .catch(function (err) {
    console.error(`Error fetching kodi: ${err}`);
  });
}

function stop() {
  let url = "http://" + ip +":" + port + "/jsonrpc?request=" + encodeURI('{"jsonrpc": "2.0", "method": "Player.Stop", "id":1, "params": { "playerid": ') + playerid + encodeURI('}}');
  fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": "Basic " + btoa(login+":"+pass)
    },
    timeout: 10000
  })
  .catch(function (err) {
    console.error(`Error fetching kodi: ${err}`);
  });
}

function key(param) {
  let url = "http://" + ip +":" + port + "/jsonrpc?request=" + encodeURI('{"jsonrpc": "2.0", "method": "Input.ExecuteAction", "params": {"action" : "') + param + encodeURI('"}, "id": 1}');
  fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": "Basic " + btoa(login+":"+pass)
    },
    timeout: 10000
  })
  .catch(function (err) {
    console.error(`Error fetching kodi: ${err}`);
  });
}

function party() {
  let url = "http://" + ip +":" + port + "/jsonrpc?request=" + encodeURI('{"jsonrpc": "2.0", "method": "Player.SetPartymode", "params": { "playerid": ') + playerid + encodeURI(',"partymode":true}}');
  fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": "Basic " + btoa(login+":"+pass)
    },
    timeout: 10000
  })
  .catch(function (err) {
    console.error(`Error fetching kodi: ${err}`);
  });
}

function vol(param) {
  let url = "http://" + ip +":" + port + "/jsonrpc?request=" + encodeURI('{"jsonrpc": "2.0", "method": "Application.SetVolume", "params": {"volume":"') + param + encodeURI('"}, "id": 1}');
  fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": "Basic " + btoa(login+":"+pass)
    },
    timeout: 10000
  })
  .then(function (response) {
    response.json()
    .then(function(data) {
      let data1 = {
        key: "volume",
        value : data.result
      }
      sendVal(data1);
    });
  })
  .catch(function (err) {
    console.error(`Error fetching kodi: ${err}`);
  });
}

function mute() {
  let url = "";
  if (muted == true)
    url = "http://" + ip +":" + port + "/jsonrpc?request=" + encodeURI('{"jsonrpc": "2.0", "method": "Application.SetMute", "id":1, "params": {"mute": false}}');
  else
    url = "http://" + ip +":" + port + "/jsonrpc?request=" + encodeURI('{"jsonrpc": "2.0", "method": "Application.SetMute", "id":1, "params": {"mute": true}}');
  fetch(url, {
    method: 'GET',
    headers: {
      "Authorization": "Basic " + btoa(login+":"+pass)
    },
    timeout: 10000
  })
  .catch(function (err) {
    console.error(`Error fetching kodi: ${err}`);
  });
}

messaging.peerSocket.addEventListener("error", (err) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});

// A user changes settings
settingsStorage.onchange = evt => {
  checkConfig()
};

// Send data to device using Messaging API
function sendVal(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}