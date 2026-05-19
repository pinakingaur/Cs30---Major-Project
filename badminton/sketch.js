// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let floor;
let net;

function setup() {
  new Canvas(1000, 600);
  displayMode(CENTER);
  world.gravity.y = 12;

  //creates the floor and net
  floor = new Sprite(500, 570, 900, 40, "static");
  floor.color = color(0);

  net = new Sprite(500, 420, 10, 220, "static");
  net.color = color(255);
}

function draw() {
  background(35, 140, 80);
}