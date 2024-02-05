document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetrisBoard');
    const context = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const row = 20;
    const col = 10;
    const sq = 20; // square size
    const colors = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'];

    let board = [];
    let score = 0;
    let dropStart = Date.now();
    let gameOver = false;
    let currentPiece;

    // Create the board
    for (r = 0; r < row; r++) {
        board[r] = [];
        for (c = 0; c < col; c++) {
            board[r][c] = 'white'; // Use white for empty squares
        }
    }

    // Draw the board
    function drawBoard() {
        for (r = 0; r < row; r++) {
            for (c = 0; c < col; c++) {
                drawSquare(c, r, board[r][c]);
            }
        }
    }

    // Draw a square
    function drawSquare(x, y, color) {
        context.fillStyle = color;
        context.fillRect(x * sq, y * sq, sq, sq);
        context.strokeStyle = 'black';
        context.strokeRect(x * sq, y * sq, sq, sq);
    }

    const Z = [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
];


    // Tetromino shapes
    const PIECES = [
        [Z, 'red'],
    ];

    // The Object Piece Constructor
    function Piece(shape, color) {
        this.shape = shape;
        this.color = color;

        this.shapeN = 0; // we start with the first pattern
        this.activeShape = this.shape[this.shapeN];

        // Control pieces
        this.x = 3;
        this.y = -2;
    }

    // Fill function
    Piece.prototype.fill = function(color) {
        for (r = 0; r < this.activeShape.length; r++) {
            for (c = 0; c < this.activeShape.length; c++) {
                // we draw only occupied squares
                if (this.activeShape[r][c]) {
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
    }

    // Draw a piece to the board
    Piece.prototype.draw = function() {
        this.fill(this.color);
    }

    // Undraw a piece
    Piece.prototype.unDraw = function() {
        this.fill('white');
    }

    // Collision detection
    Piece.prototype.collision = function(x, y, piece) {
        for (r = 0; r < piece.length; r++) {
            for (c = 0; c < piece.length; c++) {
                // If the square is empty, we skip it
                if (!piece[r][c]) {
                    continue;
                }
                // Coordinates of the piece after movement
                let newX = this.x + c + x;
                let newY = this.y + r + y;

                // Conditions
                if (newX < 0 || newX >= col || newY >= row) {
                    return true;
                }
                // Skip newY < 0; board[-1] will crush our game
                if (newY < 0) {
                    continue;
                }
                // Check if there is a locked piece already in place
                if (board[newY][newX] != 'white') {
                    return true;
                }
            }
        }
        return false;
    }

    // Control the piece
    document.addEventListener('keydown', (event) => {
        if (event.keyCode === 37) {
            currentPiece.moveLeft();
        } else if (event.keyCode === 38) {
            currentPiece.rotate();
        } else if (event.keyCode === 39) {
            currentPiece.moveRight();
        } else if (event.keyCode === 40) {
            currentPiece.moveDown();
        }
    });

    // Move Down the piece
    Piece.prototype.moveDown = function() {
        if (!this.collision(0, 1, this.activeShape)) {
            this.unDraw();
            this.y++;
            this.draw();
        } else {
            // We lock the piece and generate a new one
            this.lock();
            currentPiece = randomPiece();
        }
    }

    // Move Right the piece
    Piece.prototype.moveRight = function() {
        if (!this.collision(1, 0, this.activeShape)) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    }

    // Move Left the piece
    Piece.prototype.moveLeft = function() {
        if (!this.collision(-1, 0, this.activeShape)) {
            this.unDraw();
            this.x--;
            this.draw();
        }
    }

    // Rotate the piece
    Piece.prototype.rotate = function() {
        let nextPattern = this.shape[(this.shapeN + 1) % this.shape.length];
        let kick = 0;

        if (this.collision(0, 0, nextPattern)) {
            if (this.x > col / 2) {
                // It's the right wall
                kick = -1; // We need to move the piece to the left
            } else {
                // It's the left wall
                kick = 1; // We need to move the piece to the right
            }
        }

        if (!this.collision(kick, 0, nextPattern)) {
            this.unDraw();
            this.x += kick;
            this.shapeN = (this.shapeN + 1) % this.shape.length; // (0+1)%4 => 1
            this.activeShape = this.shape[this.shapeN];
            this.draw();
        }
    }

    // Lock function
    Piece.prototype.lock = function() {
        for (r = 0; r < this.activeShape.length; r++) {
            for (c = 0; c < this.activeShape.length; c++) {
                // Skip the vacant squares
                if (!this.activeShape[r][c]) {
                    continue;
                }
                // Pieces to lock on top = game over
                if (this.y + r < 0) {
                    alert("Game Over");
                    // Stop request animation frame
                    gameOver = true;
                    break;
                }
                // We lock the piece
                board[this.y + r][this.x + c] = this.color;
            }
        }
        // Remove full rows
        for (r = 0; r < row; r++) {
            let isRowFull = true;
            for (c = 0; c < col; c++) {
                isRowFull = isRowFull && (board[r][c] != 'white');
            }
            if (isRowFull) {
                // If the row is full
                // We move down all the rows above it
                for (y = r; y > 1; y--) {
                    for (c = 0; c < col; c++) {
                        board[y][c] = board[y-1][c];
                    }
                }
                // The top row board[0][..] has no row above it
                for (c = 0; c < col; c++) {
                    board[0][c] = 'white';
                }
                // Increment the score
                score += 10;
            }
        }
        // Update the board
        drawBoard();
        
        // Update the score
        scoreElement.innerHTML = score;
    }

    // Generate random pieces
    function randomPiece() {
    let r = Math.floor(Math.random() * PIECES.length);
    return new Piece(PIECES[r][0], PIECES[r][1]);
}


    // Drop the piece every 1sec
    function drop() {
        let now = Date.now();
        let delta = now - dropStart;
        if (delta > 1000) {
            currentPiece.moveDown();
            dropStart = Date.now();
        }
        if (!gameOver) {
            requestAnimationFrame(drop);
        }
    }

    currentPiece = randomPiece();
    drawBoard();
    drop();
});
