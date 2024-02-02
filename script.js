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
  document.addEventListener('mousedown', startDrag);
  document.addEventListener('touchstart', startDragTouch);
}

function startDrag(event) {
  startX = event.pageX;
  startY = event.pageY;
  document.addEventListener('mouseup', endDrag);
}

function startDragTouch(event) {
  if (event.touches.length === 1) { // Only deal with one finger
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
    document.addEventListener('touchend', endDragTouch);
  }
}

function endDrag(event) {
  handleDrag(event.pageX, event.pageY);
  document.removeEventListener('mouseup', endDrag);
}

function endDragTouch(event) {
  if (event.changedTouches.length === 1) {
    handleDrag(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
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

