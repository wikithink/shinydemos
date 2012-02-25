﻿var canvas;
var found,timer;

function loop() {
	var out = document.getElementById('out');
	captureToCanvas();
	if (!found) {
		out.innerHTML = '<img src="./images/qry-passive.png" alt="[Passive]"> Scan your QR code…';
		timer = setTimeout(loop,250);
	} else {
		if (timer) { clearTimeout(timer); }
		out.innerHTML = '<img src="./images/qry-happy.png" alt="[Happy]"> <a href="'+found+'">'+found+'</a>';
		var video = document.getElementById('sourcevid'), container = video.parentNode;
		canvas.style.width = video.clientWidth+'px';
		canvas.style.height = video.clientHeight+'px';
		container.removeChild(video);
		container.appendChild(canvas);
	}
}

function captureToCanvas() {
	var video = document.getElementById('sourcevid');
	canvas = document.createElement('canvas');
	canvas.width = video.videoWidth; canvas.height = video.videoHeight;
	var ctx = canvas.getContext('2d');
	ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvas.width, canvas.height);
	qrcode.decode(canvas.toDataURL());
}

function init() {
	var video = document.getElementById('sourcevid');

	// Standard and webkit methods for hooking into stream
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
	if (navigator.getUserMedia) {        
		if (window.webkitURL) {
			navigator.getUserMedia('video', function(stream) {
				// Replace the source of the video element with the stream from the camera
				video.src = window.webkitURL.createObjectURL(stream);
				timer = setTimeout(loop,250);
			}, errorCallback);
		} else {
			navigator.getUserMedia({video: true}, function(stream) {
				// Replace the source of the video element with the stream from the camera
				video.src = stream;
				timer = setTimeout(loop,250);
			}, errorCallback);
		}
		function errorCallback(error) {
			var out = document.getElementById('out');
			out.innerHTML = '<img src="./images/qry-sad.png" alt="[Sad]"> an error occurred…';
			return;
		}
	} else {
		var out = document.getElementById('out');
		out.innerHTML = '<img src="./images/qry-sad.png" alt="[sad]"> no support for <code>getUserMedia</code> detected…';
		return;
	}
	
	qrcode.callback = function(a) { found=a; }
}

window.addEventListener('load',function() {
	// PxLoader by ThinkPixelLab http://thinkpixellab.com/pxloader/
	var loader = new PxLoader(), 
	pre1 = loader.addImage('./images/qry-passive.png'),
	pre2 = loader.addImage('./images/qry-sad.png'),
	pre3 = loader.addImage('./images/qry-happy.png');
	 
	// callback that will be run once images are ready 
	loader.addCompletionListener(init); 
	 
	// begin downloading images 
	loader.start(); 

}, true);