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
let birdieVelocity = 9;

let crowd = [];

let p1Score = 0;
let p2Score = 0;

let birdieIMG;
let racketIMG;

const BASE = 100;
const LINEY1 = BASE + 80;
const LINEY2 = BASE * 5;

function preload() {
  birdieIMG = loadImage("birdie.png");
  racketIMG = loadImage("racket.png");
}

function setup() {
  new Canvas(windowWidth, windowHeight);
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

function starting_scene() {
  world.gravity.y = 12;

  // creates the floor
  floor = new Sprite();
  floor.x = BASE * 9.6;
  floor.y = 570;
  floor.width = BASE * 13;
  floor.physics = "static";
  floor.color = color(0);

  //creates net, players and birdie
  net = new Sprite(width/2, 420, 10, 220, "static");
  net.color = color(0);

  player1 = new Sprite(BASE*7, 450, 50, 100);
  player2 = new Sprite(width - 700, 450, 50, 100);

  player1.image = racketIMG;
  player2.image = racketIMG;

  player1.image.scale = 0.5;
  player2.image.scale = 0.5;

  birdie = new Sprite(width/2, 200, 18);
  birdie.image = birdieIMG;
  birdie.image.scale = 0.1;
}

function drawBirdieGraphic() {
  push();
  translate(birdie.x, birdie.y);
  rotate(frameCount * 0.05);
  fill(255);
  pop();

  // slowly bounces and stops the birdie on the right side of the net
  if (birdie.colliding(floor)) {
    if (birdie.vel.x > 1) {
      birdie.vel.x--;
    }
    else {
      birdie.vel.x = 0;
    }
  }  
}

function hitBirdie() {
  // player 1 hit
  if (kb.pressing("f")) {
    let d = dist(
      player1.x,
      player1.y - 40,
      birdie.x,
      birdie.y
    );
    if (d < 90) {
      birdie.vel.x = birdieVelocity;
      birdie.vel.y = -birdieVelocity;
    } 
  }

  // player 2 hit
  if (keyIsDown(16)) {   // It means the shift key
    let d = dist(
      player2.x,
      player2.y - 40,
      birdie.x,
      birdie.y
    );
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
    birdie.x = width/2;
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