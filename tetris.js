document.addEventListener('DOMContentLoaded', () => {
    const boardWidth = 10;
    const boardHeight = 20;
    const board = [];
    const tetrisBoard = document.getElementById('tetrisBoard');
    for (let y = 0; y < boardHeight; y++) {
        const row = [];
        for (let x = 0; x < boardWidth; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            tetrisBoard.appendChild(cell);
            row.push('');
        }
        board.push(row);
    }

    const tetrominoes = {
        I: { shape: [[1, 1, 1, 1]], color: 'cyan' },
        // Define other tetrominoes here
    };

    let currentPiece = { shape: tetrominoes.I.shape, color: tetrominoes.I.color, x: 3, y: 0 };

    function drawPiece() {
        currentPiece.shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
                if (value) {
                    const x = currentPiece.x + dx;
                    const y = currentPiece.y + dy;
                    const index = y * boardWidth + x;
                    tetrisBoard.children[index].style.backgroundColor = currentPiece.color;
                }
            });
        });
    }

    function erasePiece() {
        currentPiece.shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
                if (value) {
                    const x = currentPiece.x + dx;
                    const y = currentPiece.y + dy;
                    const index = y * boardWidth + x;
                    tetrisBoard.children[index].style.backgroundColor = '';
                }
            });
        });
    }

    function movePiece(dx, dy) {
        erasePiece();
        currentPiece.x += dx;
        currentPiece.y += dy;
        drawPiece();
    }

    function rotatePiece() {
        // Simple rotation logic (90 degrees clockwise)
        currentPiece.shape = currentPiece.shape[0].map((val, index) => currentPiece.shape.map(row => row[index]).reverse());
        erasePiece();
        drawPiece();
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') movePiece(-1, 0);
        if (e.key === 'ArrowRight') movePiece(1, 0);
        if (e.key === 'ArrowDown') movePiece(0, 1);
        if (e.key === 'ArrowUp') rotatePiece(); // Rotate on up arrow
    });

    // Touch controls
    let startX, startY;
    tetrisBoard.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        e.preventDefault();
    });

    tetrisBoard.addEventListener('touchmove', e => {
        if (!startX || !startY) return;
        const moveX = e.touches[0].clientX - startX;
        const moveY = e.touches[0].clientY - startY;

        if (Math.abs(moveX) > Math.abs(moveY)) {
            if (moveX > 0) movePiece(1, 0); // Move right
            else movePiece(-1, 0); // Move left
        } else {
            if (moveY > 0) movePiece(0, 1); // Move down faster
            // Implement upward swipe for rotation if desired
        }

        startX = 0;
        startY = 0;
        e.preventDefault();
    });

    function gameLoop() {
        setTimeout(() => {
            if (currentPiece.y < boardHeight - currentPiece.shape.length) {
                movePiece(0, 1);
            } else {
                // Reset piece
                currentPiece = { shape: tetrominoes.I.shape, color: tetrominoes.I.color, x: 3, y: 0 };
                drawPiece();
            }
            gameLoop();
        }, 1000); // Move piece down every second
    }

    drawPiece();
    gameLoop();
});
