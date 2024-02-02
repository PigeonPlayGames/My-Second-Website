document.addEventListener('DOMContentLoaded', () => {
    setupDinoJumpHandlers();
    startObstacleMovement();
});

let isJumping = false;
let score = 0;
let obstacleSpeed = 2000; // Milliseconds it takes for an obstacle to cross the screen

function setupDinoJumpHandlers() {
    const dinoRunContainer = document.getElementById('dinoRunContainer');
    dinoRunContainer.addEventListener('click', () => jumpDino());
}

function jumpDino() {
    if (isJumping) return;
    isJumping = true;
    const dino = document.getElementById('dino');
    let position = 0;
    const upInterval = setInterval(() => {
        if (position >= 150) {
            clearInterval(upInterval);
            const downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                } else {
                    position -= 10;
                    dino.style.bottom = position + 'px';
                }
            }, 20);
        } else {
            position += 10;
            dino.style.bottom = position + 'px';
        }
    }, 20);
}

function startObstacleMovement() {
    const obstacle = document.getElementById('obstacle');
    obstacle.style.animation = `moveObstacle ${obstacleSpeed / 1000}s infinite linear`;

    obstacle.addEventListener('animationiteration', () => {
        score++;
        updateScore();
        // Increase speed to make the game harder
        obstacleSpeed *= 0.98; // 2% speed increase per iteration
        obstacle.style.animationDuration = `${obstacleSpeed / 1000}s`;
    });
}

function updateScore() {
    // Assuming you have an element to display the score
    const scoreDisplay = document.getElementById('score');
    if(scoreDisplay) {
        scoreDisplay.textContent = `Score: ${score}`;
    }
}

// Add collision detection similar to previous implementation here
