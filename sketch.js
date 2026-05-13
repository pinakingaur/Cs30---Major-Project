// Major Project
// Pinakin Gaur
// April 21, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  spamCircles(); 
}

function spamCircles() {
  if(mouseIsPressed) {
    let r = random(255);
    let g = random(255);
    let b = random(255);
    fill(r, g, b);
    circle(mouseX, mouseY, 25); 
  }
}




