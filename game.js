var canvas;
var canvasContext;
var gameHeight;
var gameWidth;

var ballX = 500;
var ballY = 400;
var ballRadius = 5;
var ballHeight = ballRadius * 2;
var ballWidth = ballRadius * 2;
var ballSpeedX = 23;
var ballSpeedY = 2;

var userPaddleY = 250;
var userPaddleHeight = 100;
var userPaddleWidth = 12;

var gameViewportPosY;
var minPaddleY;
var maxPaddleY;



window.onload = function() {
	canvas = document.getElementById("game-canvas");
	canvasContext = canvas.getContext('2d');
	gameHeight = canvas.height;
	gameWidth = canvas.width;

	gameViewportPosY = canvas.getBoundingClientRect().top;
	minPaddleY = gameViewportPosY + userPaddleHeight/2;
	maxPaddleY = gameViewportPosY + gameHeight - userPaddleHeight/2;

    document.onmousemove = handleMouseMove;

	var fps = 33;
	setInterval(function()
		{
			drawEverything();
			moveBall();
		}, 1000/fps);
}

function handleMouseMove(event) {

	var dot, eventDoc, doc, body, pageX, pageY;

	event = event || window.event; // IE-ism

	// If pageX/Y aren't available and clientX/Y
	// are, calculate pageX/Y - logic taken from jQuery
		// Calculate pageX/Y if missing and clientX/Y available
	if (event.pageX == null && event.clientX != null) {
	eventDoc = (event.target && event.target.ownerDocument) || document;
	doc = eventDoc.documentElement;
	body = eventDoc.body;

	event.pageX = event.clientX +
		(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
		(doc && doc.clientLeft || body && body.clientLeft || 0);
	event.pageY = event.clientY +
		(doc && doc.scrollTop  || body && body.scrollTop  || 0) -
		(doc && doc.clientTop  || body && body.clientTop  || 0 );
	}

	dot = document.createElement('div');
	dot.className = "dot";
	dot.style.left = event.pageX + "px";
	dot.style.top = event.pageY + "px";
	document.body.appendChild(dot);

	// console.log( event.pageY, event.pageX)
	moveUserPaddle(event.pageY);

}

function moveUserPaddle(posY) {
	//paddle reached the top
	if (posY < minPaddleY) {
		userPaddleY = 0;
	}

	//paddle reached the bottom
	else if (posY > maxPaddleY) {
		userPaddleY = gameHeight - userPaddleHeight;
	}
	else userPaddleY = posY - userPaddleHeight/2;
}

function moveBall() {
	if (ballX >= gameWidth - ballRadius || ballX <= ballRadius) ballSpeedX = -ballSpeedX;
	if (ballY >= gameHeight - ballRadius || ballY <= ballRadius) ballSpeedY = -ballSpeedY;
	
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	
}

function drawEverything() {


	canvasContext.fillStyle = 'black';
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);

	canvasContext.fillStyle = "white";
	canvasContext.fillRect(20, userPaddleY, userPaddleWidth, userPaddleHeight);
	
	canvasContext.beginPath();
	canvasContext.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
	canvasContext.fillStyle = "red";
	canvasContext.fill();
	canvasContext.closePath();



}