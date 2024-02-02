document.addEventListener('DOMContentLoaded', () => {
    setupDinoJumpHandlers();
});

let isJumping = false;

function setupDinoJumpHandlers() {
    const dinoRunContainer = document.getElementById('dinoRunContainer');
    dinoRunContainer.addEventListener('click', jumpDino);
    dinoRunContainer.addEventListener('touchstart', (event) => {
        event.preventDefault(); // Prevent scrolling when touching
        jumpDino();
    }, { passive: false });
}

function jumpDino() {
    if (!isJumping) {
        isJumping = true;
        let dino = document.getElementById('dino');
        let jumpHeight = 0;
        let upInterval = setInterval(() => {
            if (jumpHeight >= 150) { // Adjust max jump height if needed
                clearInterval(upInterval);
                let downInterval = setInterval(() => {
                    if (jumpHeight <= 0) {
                        clearInterval(downInterval);
                        isJumping = false;
                    } else {
                        jumpHeight -= 10;
                        dino.style.bottom = jumpHeight + 'px';
                    }
                }, 20);
            } else {
                jumpHeight += 10;
                dino.style.bottom = jumpHeight + 'px';
            }
        }, 20);
    }
}

// Simple collision detection (for demonstration, needs refinement)
setInterval(() => {
    let dino = document.getElementById('dino');
    let obstacle = document.getElementById('obstacle');
    let dinoTop = parseInt(window.getComputedStyle(dino).bottom);
    let obstacleLeft = parseInt(window.getComputedStyle(obstacle).right);
    
    if (obstacleLeft < 40 && obstacleLeft > 0 && dinoTop < 20) {
        alert('Game Over!'); // Placeholder action
        obstacle.style.animation = 'none';
        obstacle.offsetLeft; // Trigger reflow
        obstacle.style.animation = ''; // Reset animation
    }
}, 10);
