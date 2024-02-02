document.addEventListener('DOMContentLoaded', () => {
    setupGame();
});

let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
document.addEventListener('DOMContentLoaded', () => {
    function setupGame() {
        addNewNumber();
        addNewNumber();
        updateDisplay();
        setupDragHandlers();
}

function addNewNumber() {
    let available = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) available.push({ row, col });
        }
    }
    if (available.length) {
        let spot = available[Math.floor(Math.random() * available.length)];
        board[spot.row][spot.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateDisplay() {
    const container = document.getElementById('gameContainer');
    container.innerHTML = ''; // Clear existing tiles
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            let cell = document.createElement('div');
            cell.className = 'cell number-' + board[row][col];
            cell.textContent = board[row][col] > 0 ? board[row][col] : '';
            cell.id = `cell-${row}-${col}`;
            container.appendChild(cell);
        }
    }
}

function setupDragHandlers() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.addEventListener('mousedown', startDrag);
    gameContainer.addEventListener('touchstart', startDragTouch, { passive: true });
}

function startDrag(event) {
    event.preventDefault(); // Prevent text selection
    startX = event.pageX;
    startY = event.pageY;
    document.addEventListener('mouseup', endDrag);
}

function startDragTouch(event) {
    if (event.touches.length === 1) {
        startX = event.touches[0].pageX;
        startY = event.touches[0].pageY;
        document.addEventListener('touchend', endDragTouch);
    }
}

function endDrag(event) {
    const endX = event.pageX;
    const endY = event.pageY;
    handleDrag(endX, endY);
    document.removeEventListener('mouseup', endDrag);
}

function endDragTouch(event) {
    const endX = event.changedTouches[0].pageX;
    const endY = event.changedTouches[0].pageY;
    handleDrag(endX, endY);
    document.removeEventListener('touchend', endDragTouch);
}

function handleDrag(endX, endY) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            moveRight();
        } else {
            moveLeft();
        }
    } else {
        if (deltaY > 0) {
            moveDown();
        } else {
            moveUp();
        }
    }
    addNewNumber();
    updateDisplay();
}

// Movement functions: moveLeft, moveRight, moveUp, moveDown
// You need to implement the logic for these functions based on the 2048 game rules
// For simplicity, the detailed implementations are omitted here
// Each function should update the 'board' array according to the game's rules and then call updateDisplay()

// Moves all tiles left
function moveLeft() {
    let moved = false;
    board.forEach((row, rowIndex) => {
        // Compact the row: remove zeros and slide values to the left
        let newRow = row.filter(val => val);
        for (let i = 0; i < newRow.length - 1; i++) {
            // Merge adjacent tiles of the same value
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                newRow[i + 1] = 0;
                moved = true;
            }
        }
        newRow = newRow.filter(val => val);
        while (newRow.length < 4) {
            newRow.push(0);
        }
        if (board[rowIndex].join('') !== newRow.join('')) moved = true;
        board[rowIndex] = newRow;
    });
    if (moved) addNewNumber();
}

// Moves all tiles right
function moveRight() {
    let moved = false;
    board.forEach((row, rowIndex) => {
        let newRow = row.filter(val => val).reverse();
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                newRow[i + 1] = 0;
                moved = true;
            }
        }
        newRow = newRow.filter(val => val);
        while (newRow.length < 4) {
            newRow.unshift(0);
        }
        newRow = newRow.reverse();
        if (board[rowIndex].join('') !== newRow.join('')) moved = true;
        board[rowIndex] = newRow;
    });
    if (moved) addNewNumber();
}

// Moves all tiles up
function moveUp() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        let column = board.map(row => row[col]);
        let newCol = column.filter(val => val);
        for (let i = 0; i < newCol.length - 1; i++) {
            if (newCol[i] === newCol[i + 1]) {
                newCol[i] *= 2;
                newCol[i + 1] = 0;
                moved = true;
            }
        }
        newCol = newCol.filter(val => val);
        while (newCol.length < 4) {
            newCol.push(0);
        }
        if (column.join('') !== newCol.join('')) moved = true;
        for (let row = 0; row < 4; row++) {
            board[row][col] = newCol[row];
        }
    }
    if (moved) addNewNumber();
}

// Moves all tiles down
function moveDown() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        let column = board.map(row => row[col]);
        let newCol = column.filter(val => val).reverse();
        for (let i = 0; i < newCol.length - 1; i++) {
            if (newCol[i] === newCol[i + 1]) {
                newCol[i] *= 2;
                newCol[i + 1] = 0;
                moved = true;
            }
        }
        newCol = newCol.filter(val => val);
        while (newCol.length < 4) {
            newCol.unshift(0);
        }
        newCol = newCol.reverse();
        if (column.join('') !== newCol.join('')) moved = true;
        for (let row = 0; row < 4; row++) {
            board[row][col] = newCol[row];
        }
    }
    if (moved) addNewNumber();
}
document.addEventListener('DOMContentLoaded', () => {
    setupGame(); // Existing setupGame for 2048
    document.addEventListener('keydown', jumpDino);
});

function setupDinoJumpHandlers() {
    const dinoRunContainer = document.getElementById('dinoRunContainer');
    dinoRunContainer.addEventListener('click', jumpDino);
    dinoRunContainer.addEventListener('touchstart', (event) => {
        event.preventDefault(); // Prevent scrolling when touching
        jumpDino();
    }, { passive: false });
}

let isJumping = false;

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
