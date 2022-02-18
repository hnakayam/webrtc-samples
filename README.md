# webrtc-samples
sample HTML and JavaScript code for WebRTC

# Prerequisites

install node.js then add node static using npm.

https://nodejs.org/en/download/

https://www.npmjs.com/package/node-static

start "static" web service by 

> static .

or

> static -c 0 .

to start local web server.

# projects

we have several projects in sub directories.

- audio-only : local version of WebRTC official "Audio-only peer connection demo" sample (with graph display). 

- audio-nograph : local version of WebRTC official "Audio-only peer connection demo" sample, graphs removed. 

- change-codecs : local version of WebRTC official "Choose camera, microphone and speaker" sample.

- input-output : local version of WebRTC official "Change codecs before the call" sample.

- static : static web page of basic media stream demo.

- photobooth : static web page of simple photobooth demo.

- client_old : simple WebRTC peer to peer demo client. (video only)

- client : simple WebRTC peer to peer demo client. (audio only)

all sub directory demo can be used with node.js "static" web service. change current directory to each sub directory and start 

> static -c 0 .

to start web server, then open http://localhost:8080/ by WebRTC enabled Web browser (chrome recommended).

# Note 

last 2 demos ("client" and "client_old") requires simple signaling server outside of the browser.

start signaling server by

> node signaling.js

then open above URL like other demos. You can open 2 browser tabs to access signaling server locally and connect between these 2 tabs.
Or you can use 2 separate PCs and 1 signaling server in local net. modify one top line of client/client.js like below.

> var connection = new WebSocket('ws://localhost:8888'),

to

> var connection = new WebSocket('ws://192.168.5.20:8888'),

or other actual signaling server IP address. login using 2 different user name then specify other side username in text field and press "call" button will connect 2 clients.
