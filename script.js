document.addEventListener('DOMContentLoaded', () => {
    setupDinoJumpHandlers();
});

let isJumping = false;

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
            // Down
            const downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                } else {
                    position -= 20;
                    dino.style.bottom = position + 'px';
                }
            }, 20);
        } else {
            // Up
            position += 20;
            dino.style.bottom = position + 'px';
        }
    }, 20);
}
