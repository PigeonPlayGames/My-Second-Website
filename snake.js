(function() {
    // Ensure the script executes after the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        const gameArea = document.getElementById('gameArea');
        if (gameArea.getContext) {
            const context = gameArea.getContext('2d');
            const gameWidth = gameArea.width;
            const gameHeight = gameArea.height;
            const snakeSize = 10; // Size of the snake block
            let snake = [{ x: 150, y: 150 }]; // Initial snake position
            let food = { x: 0, y: 0 }; // Initial food position
            let dx = snakeSize; // Horizontal velocity
            let dy = 0; // Vertical velocity
            let gameSpeed = 100; // Game speed in ms
            let gameInterval;

            function drawSnakePart(snakePart) {
                context.fillStyle = '#00FF00'; // Snake color
                context.fillRect(snakePart.x, snakePart.y, snakeSize, snakeSize);
            }

            function drawSnake() {
                snake.forEach(drawSnakePart);
            }

            function moveSnake() {
                const head = { x: snake[0].x + dx, y: snake[0].y + dy };
                snake.unshift(head);

                if (head.x === food.x && head.y === food.y) {
                    generateFood();
                } else {
                    snake.pop();
                }

                if (head.x < 0 || head.x >= gameWidth || head.y < 0 || head.y >= gameHeight || checkSnakeCollision(head)) {
                    clearInterval(gameInterval);
                    alert('Game Over! Refresh to play again.');
                }
            }

            function checkSnakeCollision(head) {
                return snake.some((segment, index) => {
                    return index !== 0 && segment.x === head.x && segment.y === head.y;
                });
            }

            function generateFood() {
                food = {
                    x: Math.floor(Math.random() * (gameWidth / snakeSize)) * snakeSize,
                    y: Math.floor(Math.random() * (gameHeight / snakeSize)) * snakeSize
                };
                if (snake.some(part => part.x === food.x && part.y === food.y)) {
                    generateFood();
                }
            }

            function drawFood() {
                context.fillStyle = '#FF0000'; // Food color
                context.fillRect(food.x, food.y, snakeSize, snakeSize);
            }

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

                if (Math.abs(xDiff) > Math.abs(yDiff)) {
                    if (xDiff > 0 && dx === 0) { dx = -snakeSize; dy = 0; }
                    else if (xDiff < 0 && dx === 0) { dx = snakeSize; dy = 0; }
                } else {
                    if (yDiff > 0 && dy === 0) { dx = 0; dy = -snakeSize; }
                    else if (yDiff < 0 && dy === 0) { dx = 0; dy = snakeSize; }
                }
                e.preventDefault();
            }, false);

            document.addEventListener('keydown', changeDirection);

            function main() {
                context.clearRect(0, 0, gameWidth, gameHeight);
                drawSnake();
                moveSnake();
                drawFood();
            }

            function startGame() {
                generateFood();
                if (typeof gameInterval !== 'undefined') clearInterval(gameInterval);
                gameInterval = setInterval(main, gameSpeed);
            }

            startGame();
        }
    });
})();
