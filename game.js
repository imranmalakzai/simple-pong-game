const canvas = document.getElementById("pong-canvas");
const ctx = canvas.getContext("2d");

// Game settings
const PADDLE_WIDTH = 14;
const PADDLE_HEIGHT = 90;
const BALL_SIZE = 16;
const PADDLE_SPEED = 6;
const BALL_SPEED = 5;
const AI_SPEED = 4;

// Paddles and Ball
let leftPaddle = {
  x: 0,
  y: canvas.height / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
};
let rightPaddle = {
  x: canvas.width - PADDLE_WIDTH,
  y: canvas.height / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
};
let ball = {
  x: canvas.width / 2 - BALL_SIZE / 2,
  y: canvas.height / 2 - BALL_SIZE / 2,
  width: BALL_SIZE,
  height: BALL_SIZE,
  vx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
  vy: BALL_SPEED * (Math.random() * 2 - 1),
};

let scoreLeft = 0;
let scoreRight = 0;

// Mouse control for left paddle
canvas.addEventListener("mousemove", function (e) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  leftPaddle.y = mouseY - leftPaddle.height / 2;
  // Clamp
  if (leftPaddle.y < 0) leftPaddle.y = 0;
  if (leftPaddle.y + leftPaddle.height > canvas.height)
    leftPaddle.y = canvas.height - leftPaddle.height;
});

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
  // Move ball
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Ball collision with top/bottom walls
  if (ball.y <= 0) {
    ball.y = 0;
    ball.vy *= -1;
  }
  if (ball.y + ball.height >= canvas.height) {
    ball.y = canvas.height - ball.height;
    ball.vy *= -1;
  }

  // Ball collision with paddles
  // Left paddle
  if (
    ball.x <= leftPaddle.x + leftPaddle.width &&
    ball.y + ball.height > leftPaddle.y &&
    ball.y < leftPaddle.y + leftPaddle.height
  ) {
    ball.x = leftPaddle.x + leftPaddle.width;
    ball.vx *= -1;
    // Add some "spin" based on where it hits
    let collidePoint =
      ball.y + ball.height / 2 - (leftPaddle.y + leftPaddle.height / 2);
    ball.vy = (BALL_SPEED * collidePoint) / (leftPaddle.height / 2);
  }

  // Right paddle
  if (
    ball.x + ball.width >= rightPaddle.x &&
    ball.y + ball.height > rightPaddle.y &&
    ball.y < rightPaddle.y + rightPaddle.height
  ) {
    ball.x = rightPaddle.x - ball.width;
    ball.vx *= -1;
    let collidePoint =
      ball.y + ball.height / 2 - (rightPaddle.y + rightPaddle.height / 2);
    ball.vy = (BALL_SPEED * collidePoint) / (rightPaddle.height / 2);
  }

  // Score check
  if (ball.x < 0) {
    scoreRight++;
    resetBall();
  } else if (ball.x + ball.width > canvas.width) {
    scoreLeft++;
    resetBall();
  }

  // Basic AI for right paddle
  let target = ball.y + ball.height / 2;
  let paddleCenter = rightPaddle.y + rightPaddle.height / 2;
  if (target < paddleCenter - 10) {
    rightPaddle.y -= AI_SPEED;
  } else if (target > paddleCenter + 10) {
    rightPaddle.y += AI_SPEED;
  }
  // Clamp
  if (rightPaddle.y < 0) rightPaddle.y = 0;
  if (rightPaddle.y + rightPaddle.height > canvas.height)
    rightPaddle.y = canvas.height - rightPaddle.height;

  // Update scores
  document.getElementById("score-left").textContent = scoreLeft;
  document.getElementById("score-right").textContent = scoreRight;
}

// Draw everything
function draw() {
  // Background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  ctx.fillRect(
    rightPaddle.x,
    rightPaddle.y,
    rightPaddle.width,
    rightPaddle.height
  );

  // Draw ball
  ctx.beginPath();
  ctx.arc(
    ball.x + ball.width / 2,
    ball.y + ball.height / 2,
    ball.width / 2,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "#fff";
  ctx.fill();

  // Draw center line
  ctx.strokeStyle = "#fff";
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

// Reset ball after scoring
function resetBall() {
  ball.x = canvas.width / 2 - BALL_SIZE / 2;
  ball.y = canvas.height / 2 - BALL_SIZE / 2;
  ball.vx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  ball.vy = BALL_SPEED * (Math.random() * 2 - 1);
}

// Start game
gameLoop();
