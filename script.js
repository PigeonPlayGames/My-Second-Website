document.addEventListener('DOMContentLoaded', () => {
    setupGame();
});

let isJumping = false;
let gameSpeed = 2000; // Initial speed of the obstacle
let score = 0;
let gameInterval;
let gameRunning = false;

function setupGame() {
    const dinoRunContainer = document.getElementById('dinoRunContainer');
    dinoRunContainer.addEventListener('click', jumpDino);
    startGame();
}

function jumpDino() {
    if (isJumping || !gameRunning) return;
    
    isJumping = true;
    const dino = document.getElementById('dino');
    dino.classList.add('is-jumping');

    setTimeout(() => {
        dino.classList.remove('is-jumping');
        isJumping = false;
    }, 600); // Duration of the jump animation
}

function startGame() {
    gameRunning = true;
    resetScore();
    const obstacle = document.getElementById('obstacle');
    obstacle.style.animation = `moveObstacle ${gameSpeed / 1000}s infinite linear`;

    gameInterval = setInterval(checkCollision, 10);
}

function checkCollision() {
    const dino = document.getElementById('dino');
    const obstacle = document.getElementById('obstacle');

    const dinoRect = dino.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    // Simplified collision detection
    if (obstacleRect.left < dinoRect.right && obstacleRect.right > dinoRect.left &&
        obstacleRect.bottom > dinoRect.top) {
        gameOver();
    } else {
        updateScore();
    }
}

function updateScore() {
    score += 1;
    const scoreDisplay = document.getElementById('score');
    if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${score}`;
    }
}

function gameOver() {
    clearInterval(gameInterval);
    gameRunning = false;
    const obstacle = document.getElementById('obstacle');
    obstacle.style.animationPlayState = 'paused';
    alert(`Game Over! Score: ${score}`);
    // Prompt for restart
    if (confirm('Restart game?')) {
        startGame();
    }
}

function resetScore() {
    score = 0;
    updateScore();
}

function startObstacleMovement() {
    const obstacle = document.getElementById('obstacle');
    obstacle.addEventListener('animationiteration', () => {
        // Increase difficulty by speeding up the obstacle
        gameSpeed *= 0.98;
        obstacle.style.animationDuration = `${gameSpeed / 1000}s`;
    });
}
