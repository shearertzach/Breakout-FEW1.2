const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let speedX = 2;
let speedY = -2;
const ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 3;
const brickColumnCount = 7;
const brickWidth = 50;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score = 0;
let lives = 3;

const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let column = 0; column < brickColumnCount; column += 1) {
    for (let row = 0; row < brickRowCount; row += 1) {
      if (bricks[column][row].status === 1) {
        const brickX = (column * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[column][row].x = brickX;
        bricks[column][row].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function resetShapes() {
  ballX = canvas.width / 2;
  ballY = canvas.height - 30;
  speedX = 2;
  speedY = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
}

function handleLives() {
  lives -= 1;
  // If there are no lives left
  if (!lives) {
    // eslint-disable-next-line no-alert
    alert('GAME OVER');
    document.location.reload();
    // If there are lives left
  } else {
    // Set original values
    resetShapes();
  }
}

function handleBallBounce() {
  if (ballX + speedX > canvas.width - ballRadius || ballX + speedX < ballRadius) {
    speedX = -speedX;
  }
  // If the ball hits the bottom
  if (ballY + speedY < ballRadius) {
    // Make the ball go up
    speedY = -speedY;
    // Checks to see if the ball is below 310 Y
  } else if (ballY + speedY > canvas.height - ballRadius * 2) {
    // If the ball hits the paddle
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      // Make the ball go up
      speedY = -speedY;
      // If the ball doesn't hit the paddel
    } else {
      handleLives();
    }
  }
}

function collisionDetection() {
  for (let column = 0; column < brickColumnCount; column += 1) {
    for (let row = 0; row < brickRowCount; row += 1) {
      const brick = bricks[column][row];
      if (brick.status === 1) {
        // eslint-disable-next-line max-len
        if (ballX + ballRadius > brick.x && ballX - ballRadius < brick.x + brickWidth && ballY + ballRadius > brick.y && ballY - ballRadius < brick.y + brickHeight) {
          speedY = -speedY;
          brick.status = 0;
          score += 1;
          if (score === brickRowCount * brickColumnCount) {
            // eslint-disable-next-line no-alert
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
          }
        }
      }
    }
  }
}

function detectRightPressed() {
  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  }
}

function detectLeftPressed() {
  if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  collisionDetection();
  handleBallBounce();
  drawBricks();
  drawScore();
  drawLives();

  ballX += speedX;
  ballY += speedY;

  detectLeftPressed();
  detectRightPressed();

  requestAnimationFrame(draw);
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

draw();
