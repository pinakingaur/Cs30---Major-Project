// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let floor;
let net;

let player1;
let player2;

let racket;
let birdie;

let crowd = [];

let p1Score = 0;
let p2Score = 0;

let birdieIMG;
let racketIMG;

function preload() {
  birdieIMG = loadImage("birdie.png");
  racketIMG = loadImage("racket.png");
}

function setup() {
  new Canvas(windowWidth, windowHeight);
  displayMode(CENTER);
  starting_scene();

  // birdie physics
  birdie.vel.x = random([-5, 5]);
  createAudience();
}

function draw() {
  background(35, 140, 80);

  drawRackets();
  drawCourt();
  movement();
  drawBirdieGraphic();
  hitBirdie();
  drawAudience();
  resetBirdie();
  drawUI();
  
  // console.log(mouseX, mouseY);
}

function drawCourt() {
  const LINEX = 50;
  const LINEY1 = 180;
  const LINEY2 = 540;

  line(LINEX, LINEY1, LINEX, LINEY2);   // the first line
  line(LINEX * 5, LINEY1, LINEX * 5, LINEY2);   // the second line
  line(LINEX * 15, LINEY1, LINEX * 15, LINEY2);   // the third line
  line(LINEX * 20 - LINEX, LINEY1, LINEX * 20 - LINEX, LINEY2);   // the fourth line
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

function starting_scene() {
  world.gravity.y = 12;

  // creates the floor, net, players and birdie
  floor = new Sprite(0, 570, 2000, 40, "static");
  floor.color = color(0);

  net = new Sprite(500, 420, 10, 220, "static");
  net.color = color(255);

  player1 = new Sprite(250, 450, 50, 100);
  player2 = new Sprite(750, 450, 50, 100);

  player1.image = racketIMG;
  player2.image = racketIMG;

  player1.image.scale = 0.5;
  player2.image.scale = 0.5;

  birdie = new Sprite(500, 200, 18);
  // birdie.color = "white";
  birdie.image = birdieIMG;
  birdie.image.scale = 0.1;
}

function drawBirdieGraphic() {
  push();
  translate(birdie.x, birdie.y);
  rotate(frameCount * 0.05);
  fill(255);
  // ellipse(0, 0, 18);
  // triangle(-10, 5, 10, 5, 0, 28);
  pop();
}

function hitBirdie() {
  const BIRDIE_VELOCITY = 9;
  
  // player 1 hit
  if (kb.pressing("f")) {
    let d = dist(
      player1.x,
      player1.y - 40,
      birdie.x,
      birdie.y
    );
    if (d < 90) {
      birdie.vel.x = BIRDIE_VELOCITY;
      birdie.vel.y = -BIRDIE_VELOCITY;
    } 
  }

  // player 2 hit
  if (keyIsDown(191)) {   // It means the "/" key
    let d = dist(
      player2.x,
      player2.y - 40,
      birdie.x,
      birdie.y
    );
    if (d < 90) {
      birdie.vel.x = -BIRDIE_VELOCITY;
      birdie.vel.y = -BIRDIE_VELOCITY;
    }
  }

  // completely stops birdie as soon as it hits the floor
  if (birdie.colliding(floor)) {
    birdie.vel.x = 0;
    birdie.vel.y = 0;
  }
}

function createAudience() {
  // makes and pushes 29 fans / mini circles.
  for (let i = 0; i < 29; i++) {
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
  rect(0, 0, width, 170);
  for (let fan of crowd) {  // draws the fans
    fill(fan.c);
    circle(fan.x, fan.y + frameCount % 1, 22);
  }
}

function drawRacket(player, flipped) {
  let rx;
  let ry = player.y - 50;

  if (flipped) {
    rx = player.x - 45;
  }
  else {
    rx = player.x + 45;
  }

  stroke(120, 70, 20);
  strokeWeight(8);
 
  // line(player.x, player.y, rx, ry);
  // stroke(0);
  // strokeWeight(5);
  // ellipse(rx, ry, 50, 70);

  // racket = new Sprite(player.x, player.y, rx, ry);
  // racket.image = racketIMG;
  // racket.image.scale = 0.2; 
  
}

function drawRackets() {
  drawRacket(player1, false);
  drawRacket(player2, true);
}

function resetBirdie() {
  if (birdie.y > 590) {
  // left side
    if (birdie.x < width / 2) {
      p2Score++;
    }
    
    // right side
    else {
      p1Score++;
    }
    // reset birdie
    birdie.x = 500;
    birdie.y = 200;
    birdie.vel.x = random([-5, 5]);
    birdie.vel.y = -5;
  }
}

function drawUI() {
  fill(255);
  textSize(40);
  textAlign(CENTER);
  text(p1Score + " : " + p2Score, width / 2, 70);
}