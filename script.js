document.addEventListener('DOMContentLoaded', () => {
    setupDinoJumpHandlers();
    startGame();
});

let isJumping = false;
let gameInterval;
let obstacleSpeed = 2000; // Milliseconds it takes for an obstacle to cross the screen

function setupDinoJumpHandlers() {
    const dinoRunContainer = document.getElementById('dinoRunContainer');
    dinoRunContainer.addEventListener('click', () => jumpDino());
    dinoRunContainer.addEventListener('touchstart', (event) => {
        event.preventDefault(); // Prevent scrolling when touching
        jumpDino();
    }, { passive: false });
}

function jumpDino() {
    if (!isJumping) {
        isJumping = true;
        const dino = document.getElementById('dino');
        let jumpHeight = 0;
        const upInterval = setInterval(() => {
            if (jumpHeight >= 150) { // Max jump height
                clearInterval(upInterval);
                // Dino comes down
                const downInterval = setInterval(() => {
                    if (jumpHeight <= 0) {
                        clearInterval(downInterval);
                        isJumping = false;
                    } else {
                        jumpHeight -= 5;
                        dino.style.bottom = `${jumpHeight}px`;
                    }
                }, 20);
            } else {
                // Dino goes up
                jumpHeight += 5;
                dino.style.bottom = `${jumpHeight}px`;
            }
        }, 20);
    }
}

function startGame() {
    const obstacle = document.getElementById('obstacle');
    obstacle.style.animation = `moveObstacle ${obstacleSpeed / 1000}s infinite linear`;

    gameInterval = setInterval(() => {
        const dino = document.getElementById('dino');
        const obstacle = document.getElementById('obstacle');

        const dinoBottom = parseInt(window.getComputedStyle(dino).bottom);
        const obstacleLeft = parseInt(window.getComputedStyle(obstacle).left);

        // Adjust these values based on your game's specific collision points
        if (obstacleLeft < 50 && obstacleLeft > 0 && dinoBottom < 60) {
            alert('Game Over!');
            clearInterval(gameInterval);
            obstacle.style.animation = 'none';
        }
    }, 10);
}

function resetGame() {
    clearInterval(gameInterval);
    const obstacle = document.getElementById('obstacle');
    obstacle.style.animation = 'none';
    obstacle.offsetWidth; // Trigger reflow
    startGame();
}
