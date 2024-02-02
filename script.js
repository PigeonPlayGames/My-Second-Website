document.addEventListener('DOMContentLoaded', () => {
  setupGame();
  document.addEventListener('keydown', handleInput);
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
}

function handleInput(event) {
  switch (event.keyCode) {
    case 37: // Left arrow key
      moveLeft();
      break;
    case 38: // Up arrow key
      moveUp();
      break;
    case 39: // Right arrow key
      moveRight();
      break;
    case 40: // Down arrow key
      moveDown();
      break;
    default:
      return; // Ignore other keys
  }
  addNewNumber();
  updateDisplay();
}

function moveLeft() {
  let movedOrMerged = false;
  for (let row = 0; row < 4; row++) {
    let newRow = board[row].filter(val => val); // Filter out zeros
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) { // Merge same numbers
        newRow[i] *= 2;
        newRow[i + 1] = 0;
        movedOrMerged = true;
      }
    }
    newRow = newRow.filter(val => val); // Filter out zeros again after merging
    while (newRow.length < 4) {
      newRow.push(0); // Fill with zeros to maintain row length
    }
    board[row] = newRow;
  }
  if (movedOrMerged) addNewNumber();
}

function moveRight() {
  board.forEach(row => {
    let newRow = row.filter(val => val).reverse(); // Remove zeros and reverse for right move
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
      }
    }
    newRow = newRow.filter(val => val); // Remove zeros after merging
    while (newRow.length < 4) {
      newRow.unshift(0); // Add zeros to the start to maintain row length
    }
    row.splice(0, 4, ...newRow.reverse()); // Replace original row with new values
  });
}

function moveUp() {
  for (let col = 0; col < 4; col++) {
    let column = board.map(row => row[col]).filter(val => val); // Extract and filter column
    for (let i = 0; i < column.length - 1; i++) {
      if (column[i] === column[i + 1]) {
        column[i] *= 2;
        column[i + 1] = 0;
      }
    }
    column = column.filter(val => val); // Remove zeros after merging
    while (column.length < 4) {
      column.push(0); // Fill with zeros to maintain column length
    }
    for (let row = 0; row < 4; row++) { // Update original board
      board[row][col] = column[row];
    }
  }
}

function moveDown() {
  for (let col = 0; col < 4; col++) {
    let column = board.map(row => row[col]).filter(val => val).reverse(); // Extract, filter, and reverse column for down move
    for (let i = 0; i < column.length - 1; i++) {
      if (column[i] === column[i + 1]) {
        column[i] *= 2;
        column[i + 1] = 0;
      }
    }
    column = column.filter(val => val); // Remove zeros after merging
    while (column.length < 4) {
      column.unshift(0); // Add zeros to the start to maintain column length
    }
    for (let row = 0; row < 4; row++) { // Update original board
      board[row][col] = column.reverse()[row]; // Reverse again to restore original order
    }
  }
}

function addNewNumber() {
  let emptyCells = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }
  if (emptyCells.length > 0) {
    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
  }
}

function updateDisplay() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      let cell = document.getElementById(`cell-${row}-${col}`);
      let value = board[row][col];
      cell.textContent = value > 0 ? value : "";
      cell.className = 'cell'; // Reset class
      cell.classList.add('number-' + value); // Add specific class for styling different numbers
    }
  }
}
