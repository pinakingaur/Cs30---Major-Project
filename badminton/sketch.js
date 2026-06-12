// P5play Badminton

let floor;
let net;

let player1;
let player2;

let racket;
let birdie;
let birdieVelocity = 9;

let crowd = [];

let p1Score = 0;
let p2Score = 0;

let birdieIMG;
let racketIMG;

let gameStarted = false;

let winner = "";

const BASE = 100;
const LINEY1 = BASE + 80;
const LINEY2 = BASE * 5;

// loads the images and background music
function preload() {
  birdieIMG = loadImage("birdie.png");
  racketIMG = loadImage("racket.png");

  soundFormats = ("mp3", "ogg");
  audienceBG = loadSound("audience_background_music.mp3");
}

function setup() {
  new Canvas(windowWidth, windowHeight);

  starting_scene();
  createAudience();
  audienceBG.loop();
}

function draw() {
  background(35, 140, 80);

  drawCourt();
  movement();
  checkForWinner();
  hitBirdie();
  drawAudience();
  resetBirdie();
  isBirdieOnScreen();
  drawUI();
}

function drawCourt() {
  stroke(255);
  line(BASE * 3.5, LINEY1, BASE * 3.5, LINEY2);   // the first line
  line(BASE * 7, LINEY1, BASE * 7, LINEY2);   // the second line
  line(width - 700, LINEY1, width - 700, LINEY2);   // the third line
  line(width - 350, LINEY1, width - 350, LINEY2);   // the fourth line
}

function movement() {
  const RUNNING = 5;
  const JUMPING = 11;
  
  // player 1 
  player1.vel.x = 0;
  if (kb.pressing("a")) {     // to go left
    player1.vel.x = -RUNNING;
  }
  if (kb.pressing("d")) {     // to go right
    player1.vel.x = RUNNING;
  }
  if (kb.presses("w") && player1.colliding(floor)) {    // to jump
    player1.vel.y = -JUMPING;
  }
  
  // player 2
  player2.vel.x = 0;
  if (keyIsDown(LEFT_ARROW)) {      // to go left
    player2.vel.x = -RUNNING;
  }
  if (keyIsDown(RIGHT_ARROW)) {     // to go right
    player2.vel.x = RUNNING;
  }
  if (keyIsDown(UP_ARROW) && player2.colliding(floor)) {      // to jump
    player2.vel.y = -JUMPING;
  }
}

function checkForWinner() {
  // player 1 winning
  if (p1Score >= 11 && p1Score - p2Score >= 2 && winner === "") {
    winner = "Player 1 Wins!";
    noLoop();
  }

  // player 2 winning
  if (p2Score >= 11 && p2Score - p1Score >= 2 && winner === "") {
    winner = "Player 2 Wins!";
    noLoop();
  }

  // Player 1 fell off map
  if (player1.y > height + 200 && winner === "") {
    winner = "Player 2 Wins!";
    noLoop();
  }

  // Player 2 fell off map
  if (player2.y > height + 200 && winner === "") {
    winner = "Player 1 Wins!";
    noLoop();
  }
}

function isBirdieOnScreen() {
  // Birdie fell off the screen on Player 1's side
  if (birdie.y > height + 200 && birdie.x < width / 2 && gameStarted) {
    p1Score++;

    birdie.visible = false;
    birdie.vel.x = 0;
    birdie.vel.y = 0;
    gameStarted = false;
  }

  // Birdie fell off the screen on Player 2's side
  if (birdie.y > height + 200 && birdie.x >= width / 2 && gameStarted) {
    p2Score++;

    birdie.visible = false;
    birdie.vel.x = 0;
    birdie.vel.y = 0;
    gameStarted = false;
  }
}


function starting_scene() {
  world.gravity.y = 12;

  // creates the floor
  floor = new Sprite();
  floor.x = BASE * 9.6;
  floor.y = BASE * 5.7;
  floor.width = BASE * 13;
  floor.height = BASE / 2;
  floor.physics = "static";
  floor.color = color(0);

  //  creates the net
  net = new Sprite(width/2, 420, 10, 220, "static");
  net.color = color(0);

  //  creates the players
  player1 = new Sprite(BASE * 6, BASE * 4.5, BASE / 2, BASE);
  player2 = new Sprite(width - BASE * 6, BASE * 4.5, BASE / 2, BASE);

  player1.image = racketIMG;
  player2.image = racketIMG;

  player1.image.scale = 0.5;
  player2.image.scale = 0.5;

  // creates the birdie
  birdie = new Sprite(width/2, BASE * 2, 18);
  birdie.image = birdieIMG;
  birdie.image.scale = 0.1;
  birdie.visible = false;
  birdie.vel.x = 0;
  birdie.vel.y = 0;
}

function hitBirdie() {
  // Player 1 hit (press F once)
  if (kb.presses("f")) {
    let d = dist(player1.x, player1.y - 40, birdie.x, birdie.y);

    if (d < 90) {
      birdie.vel.x = birdieVelocity;
      birdie.vel.y = -birdieVelocity;
    }
  }

  // Player 2 hit (press Shift once)
  if (kb.presses("shift")) {

    let d = dist(player2.x, player2.y - 40, birdie.x, birdie.y);

    if (d < 90) {
      birdie.vel.x = -birdieVelocity;
      birdie.vel.y = -birdieVelocity;
    }
  }
}

function createAudience() {
  // makes and pushes 60 fans / mini circles.
  for (let i = 0; i < 60; i++) {
    crowd.push({
      x: i * 35,
      y: random(70, 130),
      c: color(
        random(100,255),
        random(100,255),
        random(100,255)
      )
    });
  }
}

function drawAudience() {
  noStroke();
  fill(50);
  rect(0, 0, width, 170);   // makes the grey box for audience
  for (let fan of crowd) {  // draws the fans
    fill(fan.c);
    circle(fan.x, fan.y + frameCount % 1, 22);
  }
}

function resetBirdie() {
  if (birdie.colliding(floor) && gameStarted) {

    // Birdie landed on Player 1's side
    if (birdie.x < width / 2) {
      p2Score++;
    }

    // Birdie landed on Player 2's side
    else {
      p1Score++;
    }

    // Reset birdie and wait for B
    birdie.x = width / 2;
    birdie.y = 200;
    birdie.vel.x = 0;
    birdie.vel.y = 0;

    birdie.visible = false;
    gameStarted = false;
  }
}

function drawUI() {
  // Displays the player names and score
  fill(255);
  textSize(40);
  textAlign(CENTER);
  text(p1Score + " : " + p2Score, width / 2, 70);
  text("player ONE", 500, 200);
  text("player TWO", width - 500, 200);

  // Displays B to Start Rally on top
  if (!gameStarted) {
    textSize(28);
    text("Press B to Start Rally", width / 2, 170);
  }

  // Displays the match winner
  if (winner !== "") {
    fill(0);
    textSize(100);
    text(winner, width / 2 + 20, height / 2);

    textSize(50);
    text("Match Over", width / 2 - 15, height / 2 + 60);
  }
}

function keyPressed() {
  // Press B to reset the rally after a point
  if ((key === "b" || key === "B") && !gameStarted) {
    gameStarted = true;

    birdie.visible = true;
    birdie.x = width / 2;
    birdie.y = 200;

    birdie.vel.x = random([-5, 5]);
    birdie.vel.y = -5;
  }
}