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

let birdie;

function setup() {
  new Canvas(1000, 600);
  displayMode(CENTER);
  starting_scene();
}

function draw() {
  background(35, 140, 80);

  drawCourt();
  movement();
}

function drawCourt() {
  const LINEX = 50;
  const LINEY1 = 180;
  const LINEY2 = 540;

  line(LINEX, LINEY1, LINEX, LINEY2);
  line(LINEX * 5, LINEY1, LINEX * 5, LINEY2);
  line(LINEX * 15, LINEY1, LINEX * 15, LINEY2);
  line(LINEX * 20 - LINEX, LINEY1, LINEX * 20 - LINEX, LINEY2); 
}

function movement() {
  const Running = 5;
  const Jumping = 11;
  
  // player 1 
  player1.vel.x = 0;
  if (kb.pressing("a")) {
    player1.vel.x = -Running;
  }
  if (kb.pressing("d")) {
    player1.vel.x = Running;
  }
  if (kb.presses("w") && player1.colliding(floor)) {
    player1.vel.y = -Jumping;
  }
  
  // player 2
  player2.vel.x = 0;
  if (keyIsDown(LEFT_ARROW)) {
    player2.vel.x = -Running;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player2.vel.x = Running;
  }
  if (keyIsDown(UP_ARROW) && player2.colliding(floor)) {
    player2.vel.y = -Jumping;
  }
}

function starting_scene() {
  world.gravity.y = 12;

  //creates the floor, net, players and birdie
  floor = new Sprite(500, 570, 900, 40, "static");
  floor.color = color(0);

  net = new Sprite(500, 420, 10, 220, "static");
  net.color = color(255);

  player1 = new Sprite(250, 450, 50, 100);
  player2 = new Sprite(750, 450, 50, 100);

  birdie = new Sprite(500, 200, 18);
  birdie.color = "white";
}