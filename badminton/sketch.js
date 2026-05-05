// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let sprite;
let floor;
function setup() {
  createCanvas(windowWidth, windowHeight);
  sprite = new Sprite();
  sprite.width = 50;
  sprite.height = 50;
  sprite.x = width/2;
  sprite.y = height/2;
  
  floor = new Sprite();  
  floor.y = 190;
  floor.w = 238;
  floor.h = 5;
  floor.physics = STATIC;
}

function draw() {
  background(220);
}
