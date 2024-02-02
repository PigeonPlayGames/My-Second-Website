document.addEventListener('DOMContentLoaded', () => {
  setupGame();
});

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

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
      cell.className = 'cell';
      cell.textContent = board[row][col] > 0 ? board[row][col] : '';
      cell.id = `cell-${row}-${col}`;
      container.appendChild(cell);
    }
  }
}

// Dragging logic
let startX, startY;

function setupDragHandlers() {
  const gameContainer = document.getElementById('gameContainer');
  gameContainer.addEventListener('mousedown', startDrag);
  gameContainer.addEventListener('touchstart', startDragTouch, { passive: true });
}

function startDrag(event) {
  event.preventDefault(); // Prevent text selection
  startX = event.pageX;
  startY = event.pageY;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);
}

function onDrag(event) {
  // Optional: Implement logic here if you want to give real-time feedback as the user drags
}

function startDragTouch(event) {
  if (event.touches.length === 1) {
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
    document.addEventListener('touchmove', onDragTouch, { passive: true });
    document.addEventListener('touchend', endDragTouch);
  }
}

function onDragTouch(event) {
  // Similar to onDrag, for touch devices
}

function endDrag() {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', endDrag);
  // Logic to determine direction and move tiles
}

function endDragTouch(event) {
  document.removeEventListener('touchmove', onDragTouch);
  document.removeEventListener('touchend', endDragTouch);
  // Similar logic to determine direction and move tiles, using last touch position
}

  document.removeEventListener('touchend', endDragTouch);
}

function handleDrag(endX, endY) {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);

  if (absDeltaX > absDeltaY) {
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

// Movement functions (moveLeft, moveRight, moveUp, moveDown) should be implemented here
// These functions will contain the logic to move and merge tiles on the board

