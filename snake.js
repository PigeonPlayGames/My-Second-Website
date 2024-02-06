const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 400;
canvas.height = 400;

let snake = [{x: 200, y: 200}];
let dx = 10; // Change in x-direction
let dy = 0; // Change in y-direction

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'green';
    ctx.strokestyle = 'darkgreen';
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head); // Add new head to the beginning
    snake.pop(); // Remove the last part of the snake
}

function gameLoop() {
    setTimeout(function onTick() {
        clearCanvas();
        drawSnake();
        moveSnake();

        // Call gameLoop again
        gameLoop();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Initial game loop call
gameLoop();
