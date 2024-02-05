(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const gameArea = document.getElementById('gameArea');
        const scoreDisplay = document.getElementById('score'); // Ensure this ID matches your score element in HTML
        if (gameArea && gameArea.getContext) {
            const context = gameArea.getContext('2d');
            const gameWidth = gameArea.width;
            const gameHeight = gameArea.height;
            let snake = [{ x: 150, y: 150 }];
            let food = { x: 0, y: 0 };
            let dx = 10; // Move 10 pixels in the x direction to start with
            let dy = 0; // Initial y direction movement is 0
            let score = 0;
            let gameSpeed = 100; // Initial game speed in milliseconds
            let gameInterval;

            function drawSnakePart(snakePart) {
                context.fillStyle = '#00FF00'; // Snake color
                context.fillRect(snakePart.x, snakePart.y, 10, 10);
            }

            function drawSnake() {
                snake.forEach(drawSnakePart);
            }

            function moveSnake() {
                const head = { x: snake[0].x + dx, y: snake[0].y + dy };
                snake.unshift(head);

    // Check if the snake has eaten food
                if (head.x === food.x && head.y === food.y) {
                    score += 10; // Increment score
                    updateScore(); // Update the score display
                    generateFood(); // Generate new food
        // Increase speed as the snake eats more food
                if (gameSpeed > 30) {
                    gameSpeed -= 5;
                    clearInterval(gameInterval);
                    gameInterval = setInterval(main, gameSpeed);
                }
                } else {
                    snake.pop();
                }
                

                if (head.x < 0 || head.x >= gameWidth || head.y < 0 || head.y >= gameHeight || checkSnakeCollision(head)) {
                    clearInterval(gameInterval);
                    alert('Game Over! Score: ' + score + '. Press OK to restart.');
                    startGame(); // Restart the game
                }
            }

            function checkSnakeCollision(head) {
                for (let i = 1; i < snake.length; i++) {
                    if (head.x === snake[i].x && head.y === snake[i].y) {
                        return true;
                    }
                }
                return false;
            }

            function randomFoodPosition() {
                return {
                    x: Math.floor(Math.random() * (gameWidth / 10)) * 10,
                    y: Math.floor(Math.random() * (gameHeight / 10)) * 10
                };
            }

            function generateFood() {
                food = randomFoodPosition();
                if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
                    generateFood();
                }
            }

            function drawFood() {
                context.fillStyle = '#FF0000'; // Food color
                context.fillRect(food.x, food.y, 10, 10);
            }

            function changeDirection(event) {
                const keyPressed = event.keyCode;
                const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
                const goingLeft = dx === -10, goingUp = dy === -10, goingRight = dx === 10, goingDown = dy === 10;

                if (keyPressed === LEFT && !goingRight) { dx = -10; dy = 0; }
                if (keyPressed === UP && !goingDown) { dx = 0; dy = -10; }
                if (keyPressed === RIGHT && !goingLeft) { dx = 10; dy = 0; }
                if (keyPressed === DOWN && !goingUp) { dx = 0; dy = 10; }
            }

            function updateScore() {
                scoreDisplay.textContent = 'Score: ' + score;
            }

            function main() {
                context.clearRect(0, 0, gameWidth, gameHeight);
                drawSnake();
                moveSnake();
                drawFood();
            }

            function startGame() {
                snake = [{ x: 150, y: 150 }]; // Reset snake position
                dx = 10; // Reset movement direction
                dy = 0;
                score = 0; // Reset score
                gameSpeed = 100; // Reset game speed
                updateScore();
                generateFood();
                clearInterval(gameInterval);
                gameInterval = setInterval(main, gameSpeed);
            }

            document.addEventListener('keydown', changeDirection);
            startGame();
        }
    });
})();
