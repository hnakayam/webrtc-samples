# webrtc-samples
sample HTML and JavaScript code for WebRTC

# Prerequisites

install node.js then add node static using npm.

https://nodejs.org/en/download/

https://www.npmjs.com/package/node-static

start "static" web service by 

static .

or

static -c "no-cache" .

to server local web server.

# projects

we have several projects in this repo.

- static.html / main.js : demonstrate static web page for basic media stream

use http://localhost:8080/static.html to start main demo.

- photobooth.html : demonstrate still video capture of live stream

use http://localhost:8080/photobooth.html to start photobooth demo.

- index.html / client.js : demonstrate WebRTC client connection

start signaling server by

node signaling.js

in other command prompt window, then start http://localhost:8080/ in 2 Chrome Browser TABs then login using 2 different user names and connect from one to another.

note: in plain HTTP (no HTTPS) there's some limitation accessing camera and audio from "localhost" onky. but no restriction on signaling server so youcan modify signaling server IP address in the top of client.js, while using "static" Web Server on both sid: I.E. copy index.html and client.js for 2 PCs then start signaling.js on either of PCs. You can modify signaling server IP address ob either side but use localhost:8080/ for both side in Chrome browser.


