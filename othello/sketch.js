// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const WHITE_TILE = 0;
const BLACK_TILE = 1;
const BOARD = 5;

let rows = 8;
let cols = 8;

const CELL_SIZE = 80;

// check all 8 directions
const directions = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [1, -1], [-1, 1], [-1, -1]
];

let grid = [];
let currentPlayer = BLACK_TILE;
let opponent;
let gameRules;

function setup() {
  createCanvas(cols * CELL_SIZE, rows * CELL_SIZE);

  // create the board
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = BOARD;
    }
  }

  // starting position
  grid[3][3] = WHITE_TILE;
  grid[3][4] = BLACK_TILE;
  grid[4][3] = BLACK_TILE;
  grid[4][4] = WHITE_TILE;
}

function draw() {
  displayGrid();
  displayText();
}

function displayText() {
  fill(255);
  textStyle("bold");
  textSize(50);
  textAlign(CENTER);
  text("Othello", width/2, 50);

  textSize(24);
  if (currentPlayer === BLACK_TILE) {
    text("Turn: BLACK", width/2, height - 20);
  } 
  else {
    text("Turn: WHITE", width/2, height - 20);
  }
}

function mousePressed() {
  let x = floor(mouseX / CELL_SIZE);
  let y = floor(mouseY / CELL_SIZE);

  toggleCell(x, y);
}

function toggleCell(x, y) {
  if (x >= 0 && x < cols && y >= 0 && y < rows) {

    if (isValidMove(x, y, currentPlayer)) {
      placeAndFlip(x, y, currentPlayer);

      if (currentPlayer === BLACK_TILE) {
        currentPlayer = WHITE_TILE;
      } 
      else {
        currentPlayer = BLACK_TILE;
      }
    }
  }
}

function isValidMove(x, y, player) {
  if (!inBounds(x, y) || grid[y][x] !== BOARD) {
    return false;
  }

  for (let dir of directions) {
    if (capturesInDirection(x, y, dir[0], dir[1], player)) {
      return true;
    }
  }
  return false;
}

function capturesInDirection(x, y, dx, dy, player) {
  if (player === BLACK_TILE) {
    opponent = WHITE_TILE;
  }
  else {
    opponent = BLACK_TILE;
  }

  let cx = x + dx;
  let cy = y + dy;

  let foundOpponent = false;

  while (inBounds(cx, cy)) {
    if (grid[cy][cx] === opponent) {
      foundOpponent = true;
    }
    else if (grid[cy][cx] === player) {
      return foundOpponent;
    }
    else {
      return false;
    }

    cx += dx;
    cy += dy;
  }
  return false;
}

function placeAndFlip(x, y, player) {
  grid[y][x] = player;

  for (let dir of directions) {
    if (capturesInDirection(x, y, dir[0], dir[1], player)) {
      flipDirection(x, y, dir[0], dir[1], player);
    }
  }
}

function flipDirection(x, y, dx, dy, player) {
  if (player === BLACK_TILE) {
    opponent = WHITE_TILE;
  } 
  else {
    opponent = BLACK_TILE;
  }

  let cx = x + dx;
  let cy = y + dy;

  while (grid[cy][cx] === opponent) {
    grid[cy][cx] = player;
    cx += dx;
    cy += dy;
  }
}

function inBounds(x, y) {
  return x >= 0 && x < cols && y >= 0 && y < rows;
}

function displayGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {

      if (grid[y][x] === WHITE_TILE) {
        fill("white");
      }
      else if (grid[y][x] === BLACK_TILE) {
        fill("black");
      }
      else {
        fill("green");
      }

      square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
    }
  }
}
