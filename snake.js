const gameArea = document.getElementById('gameArea');
const context = gameArea.getContext('2d');
const gameWidth = gameArea.width;
const gameHeight = gameArea.height;
const snakeSize = 10; // Size of the snake block
let snake = [{ x: 150, y: 150 }]; // Initial snake position
let food = { x: 0, y: 0 }; // Initial food position
let dx = snakeSize; // Horizontal velocity
let dy = 0; // Vertical velocity
let score = 0;
let gameSpeed = 100; // Game speed in ms

// Function to draw the snake
function drawSnakePart(snakePart) {
  context.fillStyle = '#00FF00'; // Snake color
  context.fillRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
}

// Function to draw the snake
function drawSnake() {
  snake.forEach(drawSnakePart);
}

// Function to move the snake
function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  // Check if the snake has eaten food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    generateFood();
  } else {
    snake.pop();
  }

  // Check for collision with walls
  if (head.x < 0 || head.x >= gameWidth || head.y < 0 || head.y >= gameHeight || checkSnakeCollision(head)) {
    gameArea.innerHTML = 'Game Over! Refresh to play again.';
    clearInterval(gameInterval);
  }
}

// Function to check if the snake has collided with itself
function checkSnakeCollision(head) {
  for (let i = 4; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

// Function to generate food
function generateFood() {
  food.x = Math.floor(Math.random() * (gameWidth / snakeSize)) * snakeSize;
  food.y = Math.floor(Math.random() * (gameHeight / snakeSize)) * snakeSize;
  if (snake.some(part => part.x === food.x && part.y === food.y)) {
    generateFood(); // Regenerate if food spawns on the snake
  }
}

// Function to draw the food
function drawFood() {
  context.fillStyle = '#FF0000'; // Food color
  context.fillRect(food.x, food.y, snakeSize, snakeSize);
}

// Change direction based on keyboard input
function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;
  const goingUp = dy === -snakeSize;
  const goingDown = dy === snakeSize;
  const goingRight = dx === snakeSize;
  const goingLeft = dx === -snakeSize;

  if (keyPressed === LEFT_KEY && !goingRight) { dx = -snakeSize; dy = 0; }
  if (keyPressed === UP_KEY && !goingDown) { dx = 0; dy = -snakeSize; }
  if (keyPressed === RIGHT_KEY && !goingLeft) { dx = snakeSize; dy = 0; }
  if (keyPressed === DOWN_KEY && !goingUp) { dx = 0; dy = snakeSize; }
}

// Touch controls
let touchStartX = 0;
let touchStartY = 0;

gameArea.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, false);

gameArea.addEventListener('touchmove', (e) => {
  if (!touchStartX || !touchStartY) return;

  let xDiff = touchStartX - e.touches[0].clientX;
  let yDiff = touchStartY - e.touches[0].clientY;

  if (Math.abs(xDiff) > Math.abs(yDiff)) { // Most significant.
    if (xDiff > 0) {
      // left swipe
      if (dx === 0) { dx = -snakeSize; dy = 0; }
    } else {
      // right swipe
      if (dx === 0) { dx = snakeSize; dy = 0; }
    }
  } else {
    if (yDiff > 0) {
      // up swipe
      if (dy === 0) { dx = 0; dy = -snakeSize; }
    } else { 
      // down swipe
      if (dy === 0) { dx = 0; dy = snakeSize; }
    }
  }

  // Prevent scrolling when touching the canvas
  e.preventDefault();
}, false);

document.addEventListener('keydown', changeDirection);

// Main game loop
function main() {
  context.clearRect(0, 0, gameArea.width, gameArea.height);
  drawSnake();
  moveSnake();
  drawFood();
}

// Start the game
generateFood();
let gameInterval = setInterval(main, gameSpeed);
