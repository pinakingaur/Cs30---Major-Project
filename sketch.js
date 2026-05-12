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
    circle(mouseX, mouseY, 25); 
  }
  else if(key === "c") {
    background(220);
  }
}


