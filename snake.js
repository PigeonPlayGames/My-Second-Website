const gameArea = document.getElementById('gameArea');
const gameWidth = gameArea.clientWidth;
const gameHeight = gameArea.clientHeight;
const snakeSize = 10; // Size of the snake block
let snake = [{x: snakeSize * 5, y: snakeSize * 5}]; // Initial snake position
let food = {x: 0, y: 0}; // Initial food position
let dx = snakeSize; // Horizontal velocity
let dy = 0; // Vertical velocity
const gameSpeed = 100; // Game speed in ms

function drawSnake() {
  gameArea.innerHTML = ''; // Clear the game area
  snake.forEach(segment => {
    const snakeElement = document.createElement('div');
    snakeElement.style.left = `${segment.x}px`;
    snakeElement.style.top = `${segment.y}px`;
    snakeElement.classList.add('snake');
    gameArea.appendChild(snakeElement);
  });
}

function moveSnake() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head); // Add new head to the beginning
  snake.pop(); // Remove the last element
}

function main() {
  setTimeout(function onTick() {
    moveSnake();
    drawSnake();
    main();
  }, gameSpeed);
}

// Starting the game
main();
