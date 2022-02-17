function hasUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
if (hasUserMedia()) {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  var video = document.querySelector('video'),
    canvas = document.querySelector('canvas'),
    streaming = false;
  navigator.getUserMedia({
    video: true,
    audio: false
  }, function (stream) {
    /* video.src = window.URL.createObjectURL(stream); */
    video.srcObject = stream
    streaming = true;
  }, function (error) {
    console.log("Raised an error when capturing:", error);
  });
  document.querySelector('#capture').addEventListener('click', function (event) {
    if (streaming) {
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      var context = canvas.getContext('2d');
      context.drawImage(video, 0, 0);
    }
  });
} else {
  alert("Sorry, your browser does not support getUserMedia.");
}
