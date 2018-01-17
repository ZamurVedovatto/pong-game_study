var canvas;
var canvasContext;

var ballY = 50;
var ballX = 50; //posição inicial de saida da bola - variavel que também será incrementada a cada framePerSecond
var ballSpeedX = 15; //valor que incrementará a posição da bola a cada framePerSecond
var ballSpeedY = 5;

var player1Score = 0;
var player2Score = 0;
const WINNER_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 200;
var paddle2Y = 200;
const PADDLE_THICKNESS = 8;
const PADDLE_HEIGHT = 100; //ins in capitals because the c convention

//an event that fires everytime the mouse moves
function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect(); //the area in our browser that the canvas is in
    var root = document.documentElement; 
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}

function handleMouseClick(evt) {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        (showingWinScreen = false);
    }
}


//aparece assim que todo o html for carregado
window.onload = function() {
    canvas = document.getElementById('gameCanvas'); 
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    setInterval(function () {
        moveEverything();
        drawEverything();
    }, 1000/framesPerSecond); //função seta um intervalo de tempo que chama a função repetidas vezes

    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove', 
        function(evt) {
            var mousePos = calculateMousePos(evt);
            paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
        });
}

function computerMovement() {
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);

    if (paddle2YCenter < ballY -35) {
        paddle2Y += 6;
    } 
    else if (paddle2YCenter > ballY +35){
        paddle2Y -= 6;
    }
}

function moveEverything() {
    if (showingWinScreen) {
        return;
    }
    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX > canvas.width) { //se a bola passar da lateral direita da tela, ela retorna com o sinal invertido
        if (ballY > paddle2Y &&
            ballY < paddle2Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;

                var deltaY = ballY
                        -(paddle2Y+PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;

            } else {
                player1Score ++; //must be before ballReset()
                ballReset();
            }
    } 
    
    if (ballX < 0) { //se a bola passar da lateral esquerdo da tela, ela retorna com o sinal invertido
        if (ballY > paddle1Y &&
            ballY < paddle1Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;
                
                var deltaY = ballY
                        -(paddle1Y+PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;

            } else {
                player2Score ++; //must be before ballReset()
                ballReset();
            }
    }

    if (ballY < 0) { //se a bola passar do topo da tela, ela retorna com o sinal invertido
        ballSpeedY = -ballSpeedY;
    } 
    
    if (ballY > canvas.height) { //se a bola passar da base do canvas, ela retorna com o sinal invertido
        ballSpeedY = -ballSpeedY;
    }
}

function ballReset() {
    if (player1Score >= WINNER_SCORE ||
        player2Score >= WINNER_SCORE) {
            showingWinScreen = true;
        }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function drawEverything() {
    //next line blanks out the screen with black
    colorRect(0,0, canvas.width, canvas.height, 'green');

    if (showingWinScreen) {
        canvasContext.fillStyle = 'white';

        if (player1Score >= WINNER_SCORE) {
            canvasContext.fillText('Left Player Won!', 350, 200);
        }
        else if (player2Score >= WINNER_SCORE) {
            canvasContext.fillText('Right Player Won!', 350, 200);
        }

        canvasContext.fillText("click to continue", 350, 500);
        return;
    }

    drawNet();

    //this is left player paddle
    colorRect(0, paddle1Y, 10, PADDLE_HEIGHT, 'white');

    //this is right player paddle
    colorRect(canvas.width-PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'orange');

    // next line draws the ball
    colorCircle(ballX, ballY, 10, 'black');

    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width-100, 100);
}

function drawNet() {
    for (var i=0; i<canvas.height; i+=30) {
        colorRect(canvas.width/2-1,i,2,20, 'black');
    }
}

//draws the ball
function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath(); 
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true); //transform the rectangle in a circle
    canvasContext.fill();
}

//initial draw and position of all game elements
function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect (leftX, topY, width, height);
}