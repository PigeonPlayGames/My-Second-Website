// Get canvas element and context
const canvas = document.getElementById('snakeGame');
const ctx = canvas.getContext('2d');

// Set canvas size
const scale = 10;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let intervalTime = 250; // Initial interval time in milliseconds

(function setup() {

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fruit.draw();
        snake.update();
        snake.draw();
        
        if (snake.eat(fruit)) {
            fruit.pickLocation();
            // Decrease interval time to increase speed every time the snake eats a fruit
            intervalTime = 250 - Math.min(90, snake.total * 5);
        }

        snake.checkCollision();
        let highScore = parseInt(localStorage.getItem('highScore')) || 0;
        if (snake.total > highScore) {
            localStorage.setItem('highScore', snake.total);
        }
        document.querySelector('title').textContent = `Snake Game - Score: ${snake.total} - High Score: ${highScore}`;

        setTimeout(gameLoop, intervalTime);
    }
    gameLoop();
}());
    

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth <= 600 ? window.innerWidth - 20 : 600;
});

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale * 1;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];

    this.draw = function() {
        ctx.fillStyle = "#FFFFFF";

        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }

        ctx.fillRect(this.x, this.y, scale, scale);
    };

    this.update = function() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }

        this.tail[this.total - 1] = { x: this.x, y: this.y };

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // Wrap snake position on edge of screen
        if (this.x >= canvas.width) {
            this.x = 0;
        }

        if (this.y >= canvas.height) {
            this.y = 0;
        }

        if (this.x < 0) {
            this.x = canvas.width - scale;
        }

        if (this.y < 0) {
            this.y = canvas.height - scale;
        }
    };

    this.changeDirection = function(direction) {
        switch(direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale * 1;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale * 1;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale * 1;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale * 1;
                    this.ySpeed = 0;
                }
                break;
        }
    };

    this.eat = function(fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
        this.total++;
        // Add any visual feedback here. Example: Flash the canvas border or change snake color briefly
        return true;
    }
    return false;
    };

    this.checkCollision = function() {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                this.total = 0;
                this.tail = [];
            }
        }
    };
}

function Fruit() {
    this.x;
    this.y;

    this.pickLocation = function() {
        this.x = (Math.floor(Math.random() * columns - 1) + 1) * scale;
        this.y = (Math.floor(Math.random() * rows - 1) + 1) * scale;
    };

    this.draw = function() {
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(this.x, this.y, scale, scale);
    };
}

// Touch controls
canvas.addEventListener('touchstart', startTouch, false);
canvas.addEventListener('touchmove', moveTouch, false);

// Swipe Up / Down / Left / Right
var initialX = null;
var initialY = null;

function startTouch(e) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
};

function moveTouch(e) {
    if (initialX === null) {
        return;
    }

    if (initialY === null) {
        return;
    }

    var currentX = e.touches[0].clientX;
    var currentY = e.touches[0].clientY;

    var diffX = initialX - currentX;
    var diffY = initialY - currentY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // sliding horizontally
        if (diffX > 0) {
            // swiped left
            snake.changeDirection('Left');
        } else {
            // swiped right
            snake.changeDirection('Right');
        }
    } else {
        // sliding vertically
        if (diffY > 0) {
            // swiped up
            snake.changeDirection('Up');
        } else {
            // swiped down
            snake.changeDirection('Down');
        }
    }

    e.preventDefault();

    initialX = null;
    initialY = null;
};

