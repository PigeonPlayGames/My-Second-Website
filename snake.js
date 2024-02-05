// Get canvas element and context
const canvas = document.getElementById('snakeGame');
const ctx = canvas.getContext('2d');

// Set canvas size and scale for the game
canvas.width = window.innerWidth <= 600 ? window.innerWidth - 20 : 600;
canvas.height = 400; // Fixed height for simplicity
const scale = 10;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let fruit;
let intervalTime = 250; // Initial interval time in milliseconds

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale * 1;
    this.ySpeed = 0;
    this.total = 2; // Set initial length of the snake
    this.tail = [{x: this.x, y: this.y}, {x: this.x - scale, y: this.y}]; // Initialize with two segments

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
        if (this.total >= 1) {
            this.tail[this.total - 1] = { x: this.x, y: this.y };
        }

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // Wrap snake position on edge of screen
        this.x = this.x >= canvas.width ? 0 : this.x < 0 ? canvas.width - scale : this.x;
        this.y = this.y >= canvas.height ? 0 : this.y < 0 ? canvas.height - scale : this.y;
    };

    // Rest of the Snake function...
}


    this.changeDirection = function(direction) {
        switch(direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale;
                    this.ySpeed = 0;
                }
                break;
        }
    };

    this.eat = function(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            return true;
        }
        return false;
    };

    this.checkCollision = function() {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                this.total = 0;
                this.tail = [];
                break;
            }
        }
    };
}

function Fruit() {
    this.x;
    this.y;

    this.pickLocation = function() {
        this.x = (Math.floor(Math.random() * columns)) * scale;
        this.y = (Math.floor(Math.random() * rows)) * scale;
    };

    this.draw = function() {
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(this.x, this.y, scale, scale);
    };
}

function setup() {
    snake = new Snake();
    fruit = new Fruit();
    fruit.pickLocation();

    window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fruit.draw();
        snake.update();
        snake.draw();

        if (snake.eat(fruit)) {
            fruit.pickLocation();
        }

        snake.checkCollision();
        document.querySelector('title').textContent = `Snake Game - Score: ${snake.total}`;
    }, intervalTime);
}

// Touch controls setup
var initialX = null;
var initialY = null;

canvas.addEventListener('touchstart', (e) => {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
}, false);

canvas.addEventListener('touchmove', (e) => {
    if (!initialX || !initialY) {
        return;
    }

    var currentX = e.touches[0].clientX;
    var currentY = e.touches[0].clientY;

    var diffX = initialX - currentX;
    var diffY = initialY - currentY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal movement
        snake.changeDirection(diffX > 0 ? 'Left' : 'Right');
    } else {
        // Vertical movement
        snake.changeDirection(diffY > 0 ? 'Up' : 'Down');
    }

    e.preventDefault();
    initialX = null;
    initialY = null;
}, false);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth <= 600 ? window.innerWidth - 20 : 600;
    setup(); // Re-initialize the game to apply the new canvas size
});

setup();
