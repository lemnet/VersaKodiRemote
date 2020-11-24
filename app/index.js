import document from "document";
import * as messaging from "messaging";
import { gettext } from "i18n";
import { vibration } from 'haptics';

const main = document.getElementById('main');
const messages = document.getElementById("messages");
messages.text = gettext("connecting");
const vol = document.getElementById("vol");
const backgroundL = document.getElementById("backgroundL");
backgroundL.style.display = "none";
const backgroundS = document.getElementById("backgroundS");
backgroundS.style.display = "none";
const muteIcon = document.getElementById("muteIcon");
muteIcon.style.display = "none";
const playText = document.getElementById("playText");
playText.text = gettext("playText");
playText.style.display = "none";
const playingText = document.getElementById("playingText");
playingText.text = "--";
playingText.style.display = "none";
let configok = false;
let connok = false;
let volume = 0;
let muted = false;

// Message is received
messaging.peerSocket.onmessage = evt => {
//  console.log(`App received: ${JSON.stringify(evt)}`);
  if (evt.data.key == "checkconfig" && evt.data.value == "ok" )
    configok = true;
  else if (evt.data.key == "checkconn" && evt.data.value == "ok" )
    connok = true;
  else if (evt.data.key == "playing" ) {
    if (evt.data.value != "--") {
      playingText.text = evt.data.value;
      playText.style.display = "inline";
      playingText.style.display = "inline";
      backgroundL.style.display = "inline";
      backgroundS.style.display = "none";
    }
    else {
      playingText.text = "";
      playText.style.display = "none";
      playingText.style.display = "none";
      backgroundL.style.display = "none";
      backgroundS.style.display = "inline";
    }
  }
  else if (evt.data.key == "volume" ) {
    volume = evt.data.value;
    vol.width = (volume * 260)/100;
  }
  else if (evt.data.key == "muted" ) {
    muted = evt.data.value;
    if (muted == true)
      muteIcon.style.display = "inline";
    else
      muteIcon.style.display = "none";
  }
};

function sendCommand(command) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: command
    });
  }
}

setTimeout(function(){
  sendCommand("checkConfig");
}, 1000);


let counter = 0
function run() {
  counter = counter + 1;
  if (configok == false) {
    sendCommand("checkConfig");
    if (counter > 5)
      messages.text = gettext("connecting") + "\n\n" + gettext("appsettings");
  }
  else {
    if (connok == false) {
      sendCommand("checkConn");
      if (counter > 5)
        messages.text = gettext("connecting") + "\n\n" + gettext("appsettings");
    }
    else {
      counter = 0
      messages.style.display = "none";
      sendCommand("getVolume");
      sendCommand("getMute");
      sendCommand("getPlaying");
    }
  }
  setTimeout(run, 1000); // refresh every 1 sec
}

setTimeout(run, 1000);

//onclick
main.onclick = (evt) => {
  if (connok) {
    if (backgroundL.style.display == "inline" && backgroundS.style.display == "none") {
      if ((evt.screenX) > 25 && (evt.screenX) < 105 && (evt.screenY) > 90 && (evt.screenY) < 160) { //backwark
        sendCommand("backw");
        vibration.start('bump');
      }
      if ((evt.screenX) > 110 && (evt.screenX) < 190 && (evt.screenY) > 95 && (evt.screenY) < 160) { //play
        sendCommand("play");
        vibration.start('bump');
      }
      if ((evt.screenX) > 200 && (evt.screenX) < 280 && (evt.screenY) > 90 && (evt.screenY) < 160) { //forward
        sendCommand("forw");
        vibration.start('bump');
      }
      if ((evt.screenX) > 25 && (evt.screenX) < 105 && (evt.screenY) > 165 && (evt.screenY) < 230) { //previous
        sendCommand("prev");
        vibration.start('bump');
      }
      if ((evt.screenX) > 110 && (evt.screenX) < 190 && (evt.screenY) > 165 && (evt.screenY) < 230) { //strop
        sendCommand("stop");
        vibration.start('bump');
      }
      if ((evt.screenX) > 200 && (evt.screenX) < 280 && (evt.screenY) > 165 && (evt.screenY) < 230) { //next
        sendCommand("next");
        vibration.start('bump');
      }
    }
    else {
 if ((evt.screenX) > 25 && (evt.screenX) < 105 && (evt.screenY) > 10 && (evt.screenY) < 85) { //back
        sendCommand("back");
        vibration.start('bump');
      }
      if ((evt.screenX) > 110 && (evt.screenX) < 190 && (evt.screenY) > 10 && (evt.screenY) < 85) { //up
        sendCommand("up");
        vibration.start('bump');
      }
      if ((evt.screenX) > 25 && (evt.screenX) < 105 && (evt.screenY) > 90 && (evt.screenY) < 160) { //left
        sendCommand("left");
        vibration.start('bump');
      }
      if ((evt.screenX) > 110 && (evt.screenX) < 190 && (evt.screenY) > 90 && (evt.screenY) < 160) { //ok
        sendCommand("ok");
        vibration.start('bump');
      }
      if ((evt.screenX) > 200 && (evt.screenX) < 280 && (evt.screenY) > 90 && (evt.screenY) < 160) { //right
        sendCommand("right");
        vibration.start('bump');
      }
      if ((evt.screenX) > 110 && (evt.screenX) < 190 && (evt.screenY) > 165 && (evt.screenY) < 230) { //down
        sendCommand("down");
        vibration.start('bump');
      }
      if ((evt.screenX) > 200 && (evt.screenX) < 280 && (evt.screenY) > 165 && (evt.screenY) < 230) { //party
        sendCommand("party");
        vibration.start('bump');
      } 
    }
    if ((evt.screenX) > 125 && (evt.screenX) < 175 && (evt.screenY) > 240 && (evt.screenY) < 290) { //mute
      sendCommand("mute");
      vibration.start('bump');
    }
    else if ((evt.screenX) > 0 && (evt.screenX) < 80 && (evt.screenY) > 240 && (evt.screenY) < 300) { //vol-
      sendCommand("volmin");
      vibration.start('bump');
    }
    else if ((evt.screenX) > 220 && (evt.screenX) < 300 && (evt.screenY) > 240 && (evt.screenY) < 300) { //vol+
      sendCommand("volplus");
      vibration.start('bump');
    }
  }
}