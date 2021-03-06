var canvas;
var canvasContext;
var gameHeight;
var gameWidth;
var fps = 22;
var frame = 0
var paddleMargin = 20;
var logEnabled = false;
var logLevel = 0;
var randomizeGame = 0;

var initialCircleRadius = 8;
var ballX = 300;
var ballY = 250;
var ballRadius = 5;
var ballHeight = ballRadius * 2;
var ballWidth = ballRadius * 2;
var ballSpeedX;
var ballSpeedY;
var ballVelocity;
var desiredInitialSpeed = 3;
var ballSlope;

var paddleHeight = 100;
var paddleWidth = 12;

var paddleTop = 250;
var prevPaddleY = 250;
var paddleVelocity = 0;
var paddle1SurfaceX = paddleMargin + paddleWidth;
var paddleBottom = paddleTop + paddleHeight;
var paddle2SurfaceX;

var gameViewportPosY;
var minPaddleY;
var maxPaddleY;
var paddleTimer;

var hitCount = 0;
var playBall = false;



window.onload = function() {
	handleKeyPress();

	canvas = document.getElementById("game-canvas");
	canvasContext = canvas.getContext('2d');
	gameHeight = canvas.height;
	gameWidth = canvas.width;

	paddle2SurfaceX = gameWidth - (paddleMargin + paddleWidth);

	gameViewportPosY = canvas.getBoundingClientRect().top;
	minPaddleY = gameViewportPosY + paddleHeight/2;
	maxPaddleY = gameViewportPosY + gameHeight - paddleHeight/2;

	randomizeGame = randomizeGame || Math.floor(Math.random() * 60) + 40;
	console.log(`randomizeGame: ${randomizeGame}`);
	initialCircleRadius = 8;
	ballX = Math.floor(gameWidth / 2) + initialCircleRadius ;
	ballY = 240;


    document.onmousemove = handleMouseMove;

	setInterval(function()
		{
			frame++;
			drawEverything();
			moveBall();
		}, 1000/fps);
}

function handleMouseMove(event) {

	var dot, eventDoc, doc, body, pageX, pageY;

	event = event || window.event; // IE-ism

	// IfpageX/Y aren't available and clientX/Y
	// are, calculate pageX/Y - logic taken from jQuery
		// Calculate pageX/Y ifmissing and clientX/Y available
	if(event.pageX == null && event.clientX != null) {
	eventDoc = (event.target && event.target.ownerDocument) || document;
	doc = eventDoc.documentElement;
	body = eventDoc.body;

	event.pageX = event.clientX +
		(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
		(doc && doc.clientLeft || body && body.clientLeft || 0);
	event.pageY = event.clientY +
		(doc && doc.scrollTop  || body && body.scrollTop  || 0) -
		(doc && doc.clientTop  || body && body.clientTop  || 0);
	}

// create white dots to show where the cursor has been
	// dot = document.createElement('div');
	// dot.className = "dot";
	// dot.style.left = event.pageX + "px";
	// dot.style.top = event.pageY + "px";
	// document.body.appendChild(dot);

	// console.log( event.pageY, event.pageX)

	moveUserPaddle(event.pageY);
	window.clearTimeout(paddleTimer);
	// zeroes out paddleVelocity after a frame of inaction.
	paddleTimer = window.setTimeout(function() {paddleVelocity = 0; if(logEnabled)console.log(`paddleVelocity: ${paddleVelocity}`)}, 1000/fps);

}


function handleKeyPress(){
	document.addEventListener('keydown', (event) => {
		const keyName = event.key;

		console.log(`Key pressed ${keyName}`);

		if(event.key == 'ArrowUp'){
			fps++;
			console.log(`fps: ${fps} \nballVelocity: ${ballVelocity}`);
		}
		if(event.key == 'ArrowDown'){
			fps--;
			console.log(`fps: ${fps} \nballVelocity: ${ballVelocity}`);
		}

		if (event.key == 'b'){
			logLevel++;
			switch (logLevel % 4) {
				case 1:
					logEnabled = true;
					console.log("LOG ENABLED -- LOG LVL 1 - BASIC");
					break;
				case 2:
					console.log("LOG ENABLED -- LOG LVL 2 - DEV");
					break;
				case 3:
					console.log("LOG ENABLED -- LOG LVL 3 - MATH");
					break;
				case 0:
					logEnabled = false;
					console.log("LOG DISABLED");
					break;

			}
		}
	}, false);
}

function calculatePaddleVelocity(posY) {
	if(prevPaddleY && posY != prevPaddleY && posY > minPaddleY && posY < maxPaddleY) {
		paddleVelocity = posY > prevPaddleY ? Math.pow((posY - prevPaddleY), .4) : Math.pow((prevPaddleY - posY), .4) * -1 || 0;
		// console.log("paddleVelocity: " + paddleVelocity + " diff: " + (posY - prevPaddleY));
	}
	// else console.log(paddleVelocity, prevPaddleY, posY);
	prevPaddleY = posY;
}

function moveUserPaddle(posY) {
	//paddle reached the top
	if(posY < minPaddleY) {
		paddleTop = 0;
	}

	//paddle reached the bottom
	else if(posY > maxPaddleY) {
		paddleTop = gameHeight - paddleHeight;
	}
	else paddleTop = posY - paddleHeight/2;
	paddleBottom = paddleTop + paddleHeight;
	
	calculatePaddleVelocity(posY);
}

function initialBallMotion() {

	ballSpeedX = Math.cos(Math.PI/10 * (frame))*8;
	ballSpeedY = Math.sin(Math.PI/8 * (frame))*8;

	if(logLevel % 4 == 2) console.log(`ballSpeedX: ${ballSpeedX} \nballSpeedY: ${ballSpeedY}`);

	if(randomizeGame == frame) playBall = true;
	
}

function moveBall() {
	if(playBall){

		if(ballX >= gameWidth - ballRadius || ballX <= ballRadius) ballSpeedX = -ballSpeedX;
		if(ballY >= gameHeight - ballRadius || ballY <= ballRadius) ballSpeedY = -ballSpeedY;

		if(ballSpeedX < 0) {
			ballLeft = ballX - ballRadius;
			if(ballLeft <= paddle1SurfaceX - ballSpeedX/2 && ballLeft >= paddle1SurfaceX + ballSpeedX/2) {
				if(ballY + (ballRadius * (Math.sqrt(2)))/2 > paddleTop && ballY - (ballRadius * (Math.sqrt(2)))/2 <= paddleBottom) {
					hitCount ++;
					ballSlope = ballSpeedY/ballSpeedX;

					ballVelocity = Math.pow((Math.pow(ballSpeedX, 2) + Math.pow(ballSpeedY, 2)) , .5);
					ballSpeedY += paddleVelocity;

					ballSpeedX = Math.pow((Math.pow(ballVelocity, 2) - Math.pow(ballSpeedY, 2)) , .5) || 1;
					// ballSpeedX -= Math.pow((Math.pow(ballSpeedX, 2) / Math.pow(paddleVelocity, 2)) , .5);
					// Math.abs(Math)
					if (hitCount % 3 === 0) ballSpeedX = ballSpeedX + 1

					if(logEnabled)console.log("ballVelocity: " + ballVelocity + "\npaddleVelocity: " + paddleVelocity + "\nballSpeedX: " + ballSpeedX + "\nballSpeedY: " + ballSpeedY);
				}
				else if(logEnabled) console.log("ball MISSED" + "\nballY: " + ballY + "\npaddleTop: " + paddleTop + "\nball bottom-left corner: " + (ballY + (ballRadius * (Math.sqrt(2)))/2) + "\npaddleBottom: " + paddleBottom + "\nball top-left corner: " + (ballY - (ballRadius * (Math.sqrt(2)))/2));
			}
		}

		if(ballSpeedX > 0) {
			ballRight = ballX + ballRadius;
			if(ballRight >= paddle2SurfaceX - ballSpeedX/2 && ballRight <= paddle2SurfaceX + ballSpeedX/2) {
				if(ballY + (ballRadius * (Math.sqrt(2)))/2 > paddleTop && ballY - (ballRadius * (Math.sqrt(2)))/2 <= paddleBottom) {
					hitCount ++;
					ballSlope = ballSpeedY/ballSpeedX;

					ballVelocity = Math.pow((Math.pow(ballSpeedX, 2) + Math.pow(ballSpeedY, 2)) , .5);
					ballSpeedY += paddleVelocity;

					ballSpeedX = -1 * ( Math.pow((Math.pow(ballVelocity, 2) - Math.pow(ballSpeedY, 2)) , .5) ) || -1;
					// ballSpeedX -= Math.pow((Math.pow(ballSpeedX, 2) / Math.pow(paddleVelocity, 2)) , .5);
					// Math.abs(Math)
					if (hitCount % 3 === 0) ballSpeedX = ballSpeedX - 1;

					if(logEnabled) console.log("ballVelocity: " + ballVelocity + "\npaddleVelocity: " + paddleVelocity + "\nballSpeedX: " + ballSpeedX + "\nballSpeedY: " + ballSpeedY);
				}
				else if(logEnabled) console.log("ball MISSED" + "\nballY: " + ballY + "\npaddleTop: " + paddleTop + "\nball bottom-right corner: " + (ballY + (ballRadius * (Math.sqrt(2)))/2) + "\npaddleBottom: " + paddleBottom + "\nball top-right corner: " + (ballY - (ballRadius * (Math.sqrt(2)))/2));
			}
		}

	}
	else initialBallMotion();


		ballX += ballSpeedX;
		ballY += ballSpeedY;


	if(logEnabled && frame % 30 == 0) console.log ("ballX: " + ballX, ", ballY: " + ballY + "\nballSpeedX: " + ballSpeedX + ", ballSpeedY: " + ballSpeedY);
	
}

function drawEverything() {


	canvasContext.fillStyle = 'black';
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);

	canvasContext.beginPath();
	canvasContext.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
	canvasContext.fillStyle = "#FA0";
	canvasContext.fill();

	canvasContext.fillStyle = "white";
	canvasContext.fillRect(paddleMargin, paddleTop, paddleWidth, paddleHeight);

	canvasContext.fillStyle = "#FA0";
	canvasContext.fillRect((paddleMargin + paddleWidth) - 3, paddleTop, 2, paddleHeight);

	canvasContext.fillStyle = "white";
	canvasContext.fillRect(gameWidth - paddleMargin - paddleWidth, paddleTop, paddleWidth, paddleHeight);

	canvasContext.fillStyle = "#FA0";
	canvasContext.fillRect((gameWidth - paddleMargin - paddleWidth) + 1, paddleTop, 2, paddleHeight);


}