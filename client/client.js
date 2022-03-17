'use strict';

// use trivial signaling server script, "signaling.js"
var connection = new WebSocket('ws://localhost:8888'),
    username = "";

var loginPage = document.querySelector('#login-page'),
    usernameInput = document.querySelector('#username'),
    loginButton = document.querySelector('#login'),
    callPage = document.querySelector('#call-page'),
    theirUsernameInput = document.querySelector('#their-username'),
    callButton = document.querySelector('#call'),
    hangUpButton = document.querySelector('#hang-up');

callPage.style.display = "none";

// set default username (if any)
usernameInput.value = username;

// Login when the user clicks the button
loginButton.addEventListener("click", function (event) {
  username = usernameInput.value;

  if (username.length > 0) {
    send({
      type: "login",
      name: username
    });
  }
});

connection.onopen = function () {
  console.log("Connected to signaling server.");
};

// Handle all messages through this callback
connection.onmessage = function (message) {
  console.log("Got message", message.data);

  var data = JSON.parse(message.data);

  message_text.value = data.type;

  switch(data.type) {
    case "login":
      onLogin(data.success);
      break;
    case "offer":
      onOffer(data.offer, data.name);
      break;
    case "answer":
      onAnswer(data.answer);
      break;
    case "candidate":
      onCandidate(data.candidate);
      break;
    case "leave":
      onLeave();
      break;
    default:
      break;
  }
};

connection.onerror = function (err) {
  console.log("Got error", err);
};

// Alias for sending messages in JSON format
function send(message) {
  if (connectedUser) {
    message.name = connectedUser;
  }

  connection.send(JSON.stringify(message));
};

function onLogin(success) {
  if (success === false) {
    alert("Login unsuccessful, please try a different name.");
  } else {
    loginPage.style.display = "none";
    callPage.style.display = "block";

    // Get the plumbing ready for a call
    startConnection();
  }
};

callButton.addEventListener("click", function () {
  var theirUsername = theirUsernameInput.value;

  if (theirUsername.length > 0) {
    startPeerConnection(theirUsername);
  }
});

hangUpButton.addEventListener("click", function () {

  if (connectedUser) {
    send({
      type: "leave"
    });

    message_text.value = 'leave send';

    onLeave();
  }
});

// offer received from peer
function onOffer(offer, name) {
  connectedUser = name;
  yourConnection.setRemoteDescription(new RTCSessionDescription(offer));

  yourConnection.createAnswer(function (answer) {
    yourConnection.setLocalDescription(answer);
    send({
      type: "answer",
      answer: answer
    });

    message_text.value = 'answer send';

  }, function (error) {
    alert("An error has occurred");
  });
}

function onAnswer(answer) {
  yourConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

function onCandidate(candidate) {
  yourConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

function onLeave() {
  console.log('Ending call');

  connectedUser = null;

  /* theirVideo.src = null; */
  /* localStream.getTracks().forEach(track => track.stop()); */
  audio2.srcObject = null;

  yourConnection.close(); // this will close connection

  yourConnection.onsignalingstatechange = null;
  yourConnection.onicecandidate = null;
  /* yourConnection.ontrack = null; */
  yourConnection.onaddstream = null;

  // re-use localStream
  setupPeerConnection(localStream);
};

function hasUserMedia() {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  return !!navigator.getUserMedia;
};

function hasRTCPeerConnection() {
  window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
  window.RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;
  window.RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate || window.mozRTCIceCandidate;
  return !!window.RTCPeerConnection;
};

// var yourVideo = document.querySelector('#yours'),
//     theirVideo = document.querySelector('#theirs');
const audio2 = document.querySelector('audio#audio2');
const message_text = document.querySelector('#message');
const status_text = document.querySelector('#signaling');
var yourConnection, connectedUser, localStream = undefined;

function startConnection() {

  // check Browser capability
  if (!hasUserMedia()) {
    alert("Sorry, your browser does not support WebRTC.");
  }
  else if (!hasRTCPeerConnection()) {
    alert("Sorry, your browser does not support WebRTC.");
  }
  else if (localStream === undefined) {
    // acquire media and if successful, set media to PeerConnection object
    // this will take some time
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    })
    .then(gotStream)
    .catch(e => {
      alert(`getUserMedia() error: ${e.name}`);
    });

  }
  // otherwise, we already acquired localStream
  
};

// setup RTCPeerConnection except audio stream
// audio stream will be set lator
function setupPeerConnection(stream) {
  var configuration = {
    "iceServers": [{ "url": "stun:127.0.0.1:9876" }]
  };
  yourConnection = new RTCPeerConnection(configuration);

  // Setup stream listening
  yourConnection.addStream(stream);   // at this point, no event handler set
  yourConnection.onaddstream = function (event) {   // set handler for remote stream
    /* theirVideo.srcObject = event.stream; */
    if (audio2.srcObject !== event.stream) {
      audio2.srcObject = event.stream;
      console.log('Received remote stream');
    }
  };

  // yourConnection.ontrack = function (event) {
  //   if (audio2.srcObject !== event.streams[0]) {
  //     audio2.srcObject = event.streams[0];
  //     console.log('Received remote stream');
  //   }
  // };

  // Setup ice handling event
  yourConnection.onicecandidate = function (event) {
    if (event.candidate) {
      send({
        type: "candidate",
        candidate: event.candidate
      });

      message_text.value = 'candidate send';
    }
  };

  // Setup signaling status change event
  yourConnection.onsignalingstatechange = function (event) {

    status_text.value = yourConnection.signalingState;

  };

};

// got mediaStream event
function gotStream(stream) {
  console.log('Received local stream');
  localStream = stream;

  /* yourVideo.srcObject = localStream; */

  // const audioTracks = localStream.getAudioTracks();
  // if (audioTracks.length > 0) {
  //   console.log(`Using Audio device: ${audioTracks[0].label}`);
  // }
  // localStream.getTracks().forEach(track => yourConnection.addTrack(track, localStream));
  // console.log('Adding Local Stream to peer connection');

  setupPeerConnection(localStream);

  //
  // add preference here, must be set before offer to send
  //

};

// connection start : send offer
function startPeerConnection(user) {
  connectedUser = user;

  // Begin the offer
  yourConnection.createOffer(function (offer) {
    send({
      type: "offer",
      offer: offer
    });

    message_text.value = 'offer send';

    yourConnection.setLocalDescription(offer);
  }, function (error) {
    alert("An error has occurred.");
  });
};
