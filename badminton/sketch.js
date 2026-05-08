// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const LINE_DISTANCE = 100;
function setup() {
  createCanvas(windowWidth, windowHeight);
  drawCourt();
}

function draw() {
  background(50);
}

function drawCourt() {
  // the most bottom line of the court
  let bottomLine = new Sprite();  
  bottomLine.y = height - LINE_DISTANCE;
  bottomLine.x = width/2;
  bottomLine.h = 5;
  bottomLine.w = width;
  bottomLine.color = "white";

  // the second bottom line of the court
  let bottomLine2 = new Sprite();  
  bottomLine2.y = height - LINE_DISTANCE*2;
  bottomLine2.x = width/2;
  bottomLine2.h = 5;
  bottomLine2.w = width;
  bottomLine2.color = "white";

  // the highest line of the court
  let topLine = new Sprite();  
  topLine.y = LINE_DISTANCE;
  topLine.x = width/2;
  topLine.h = 5;
  topLine.w = width;
  topLine.color = "white";

  // the second highest line of the court
  let topLine2 = new Sprite();  
  topLine2.y = LINE_DISTANCE*2;
  topLine2.x = width/2;
  topLine2.h = 5;
  topLine2.w = width;
  topLine2.color = "white";
}