// script.js
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
  // Place the first two numbers
  addNewNumber();
  addNewNumber();
  updateDisplay();
}

function addNewNumber() {
  let added = false;
  while (!added) {
    let row = Math.floor(Math.random() * 4);
    let col = Math.floor(Math.random() * 4);
    if (board[row][col] === 0) {
      board[row][col] = Math.random() > 0.5 ? 2 : 4;
      added = true;
    }
  }
}

function updateDisplay() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      let cell = document.querySelector(`#cell-${row}-${col}`);
      cell.textContent = board[row][col] === 0 ? "" : board[row][col];
    }
  }
}
