/* eslint-disable import/extensions */
import Brick from './js/Brick.js';
import Ball from './js/Ball.js';
import Paddle from './js/Paddle.js';
import Scoreboard from './js/Scoreboard.js';
// import Game from './js/Game.js'

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const ballRadius = 10;

const ball = new Ball(canvas, 10);
const paddle = new Paddle(canvas);
const scoreboard = new Scoreboard(canvas);

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 3;
const brickColumnCount = 7;
const brickWidth = 50;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = new Brick(canvas, 0, 0, 1);
  }
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

function handleLives() {
  scoreboard.lives -= 1;
  // If there are no lives left
  if (!scoreboard.lives) {
    // eslint-disable-next-line no-alert
    alert('GAME OVER');
    document.location.reload();
    // If there are lives left
  } else {
    // Set original values
    ball.resetBall(canvas);
  }
}

function handleBallBounce() {
  if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
    ball.dx = -ball.dx;
  }
  // If the ball hits the bottom
  if (ball.y + ball.dy < ballRadius) {
    // Make the ball go up
    ball.dy = -ball.dy;
    // Checks to see if the ball is below 310 Y
  } else if (ball.y + ball.dy > canvas.height - ballRadius * 2) {
    // If the ball hits the paddle
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.paddleWidth) {
      // Make the ball go up
      ball.dy = -ball.dy;
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
        if (ball.x + ballRadius > brick.x && ball.x - ballRadius < brick.x + brickWidth && ball.y + ballRadius > brick.y && ball.y - ballRadius < brick.y + brickHeight) {
          ball.dy = -ball.dy;
          brick.status = 0;
          scoreboard.score += 1;
          if (scoreboard.score === brickRowCount * brickColumnCount) {
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
    paddle.x += 7;
    if (paddle.x + paddle.paddleWidth > canvas.width) {
      paddle.x = canvas.width - paddle.paddleWidth;
    }
  }
}

function detectLeftPressed() {
  if (leftPressed) {
    paddle.x -= 7;
    if (paddle.x < 0) {
      paddle.x = 0;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.render(ctx);
  paddle.render(ctx);
  collisionDetection();
  handleBallBounce();
  drawBricks();
  scoreboard.drawScore(ctx);
  scoreboard.drawLives(ctx);

  ball.x += ball.dx;
  ball.y += ball.dy;

  detectLeftPressed();
  detectRightPressed();

  requestAnimationFrame(draw);
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.paddleWidth / 2;
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
