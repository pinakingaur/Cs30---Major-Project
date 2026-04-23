// 8 Ball Pool
// Pinakin Gaur
// April 21, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let poolImg;
let matter;  
let balls = [];
let cueBall; 
let aimLine; 
const ballRadius = 12;
const cueBallOrigin = 1000;
const pocketToBallRatio = 4;
const rim = 40; 
let debugMode = false;
let dragStart;

class HitBox {
  // makes the rectangles
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h; 
    //  centers
    let cx = x + w / 2;
    let cy = y + h / 2;
    this.body = Matter.Bodies.rectangle(cx, cy, w, h, {
      isStatic: true,
    });
    Matter.World.add(matter.world, this.body);
  }
}

class Ball {
  constructor(x, y, name) {
    this.name = name;

    // gives the balls physics
    this.body = Matter.Bodies.circle(x, y, ballRadius, {
      restitution: 0.9,
      friction: 0.01,
      density: 0.01
    });
    Matter.World.add(matter.world, this.body);
  }
  // ball positioning
  x() {
    return this.body.position.x;
  }
  y() {
    return this.body.position.y;
  }

  // sets position
  setPosition(x, y) {
    Matter.Body.setPosition(this.body, { x, y});
  }

  // sets velocity
  setVelocity(x, y) {
    Matter.Body.setVelocity(this.body, { x, y});
  }

  // getting velocity
  velocity() {
    return new p5.Vector(this.body.velocity.x, this.body.velocity.y);
  }

  // displays the ball
  display() {
    push();
    translate(this.x(), this.y());
    noStroke();
    sphere(ballRadius);
    pop();
  }
}

function rackBalls() {
  // draws the cue ball
  cueBall = new Ball(cueBallOrigin, table.centerY(), "cue");
  balls.push(cueBall);

  // draws the pool balls in a triangle
  const footSpotX = 290;
  const spacing = 2 * ballRadius + 3;
  const xOffset = sqrt(3) * ballRadius;
  let rowLength = 1;
  let i = 0;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < rowLength; col++) {
      let xPos = footSpotX - row * xOffset;
      let yPos = table.centerY() - (rowLength - 1) * ballRadius + col * spacing;
      balls.push(new Ball(xPos, yPos));
      i++;
    }
    rowLength++;
  }
}

//Width between canvas and the table
const table = {
  left: 35, 
  top: 300,
  right: 1121,
  bottom: 861,
  boundaries: [],
  pockets: [],

  tableWidth: function () {
    return this.right - this.left;
  },
  tableHeight: function () {
    return this.bottom - this.top;
  },
  centerY: function () {
    return this.top + this.tableHeight() / 2;
  },  
  // makes the boundary lines on table
  boundariesLine: function () {
    this.boundaries = [
      new HitBox(this.left, this.top, this.tableWidth(), rim),
      new HitBox(this.left, this.bottom, this.tableWidth(), rim),
      new HitBox(this.left, this.top, rim, this.tableHeight()),
      new HitBox(this.right, this.top, rim, this.tableHeight() + rim),
    ];
  },
  // makes the pocket holes
  pocketHoles: function() {
    this.pockets = [
      createVector(59, 322),  //top - left pocket
      createVector(591, 322), //top - middle pocket
      createVector(1133, 322), //top - right pocket
      createVector(1133, 877), //bottom - left pocket
      createVector(595, 890), //bottom - middle pocket  
      createVector(59, 877), //bottom - right pocket
    ];
  },
  checkPockets: function () {
    for (let i = balls.length - 1; i >= 0; i--) {
      let ball = balls[i];
      for (let pocket of table.pockets) {
        let d = dist(ball.body.position.x, ball.body.position.y, pocket.x, pocket.y);
        if (d < ballRadius * pocketToBallRatio) {
          if (ball.name === "cue") {
            resetCueBall();
          } 
          else {
            Matter.World.remove(matter.world, ball.body);
            balls.splice(i, 1);
          }
        }
      }
    }
  },
};

function preload() {
  poolImg = loadImage("table.png");
}

function keyPressed() {
  if (key === "d") {
    debugMode =! debugMode;
  }
}

function drawDebug() {
  // makes a visible table border
  if (!debugMode) return;
  push();
  stroke("blue");
  strokeWeight(3);
  let c = color("pink");
  c.setAlpha(100);
  fill(c);
  for (let b of table.boundaries) {
    rect(b.x, b.y, b.w, b.h);
  }
  pop();

  // pockets
  push();
  fill("yellow");
  noStroke();
  table.pockets.forEach((pocket) => {
    let r = ballRadius * pocketToBallRatio;
    ellipse(pocket.x, pocket.y, r, r);
  });
  pop();
}

function mousePressed() {
  if (!cueBall) return;
  let nearCueBall =
      dist(mouseX, mouseY, cueBall.body.position.x, cueBall.body.position.y) <= ballRadius * 2;
  if (nearCueBall) {
    dragStart = createVector(mouseX, mouseY);
  }
}

function mouseReleased() {
  if (!dragStart) return;
  let force = p5.Vector.sub(dragStart, createVector(mouseX, mouseY));
  force.mult(0.1);
  Matter.Body.setVelocity(cueBall.body, force);
  dragStart = null;
}


function drawCueLine() {
  stroke("pink");
  strokeWeight(4);
  line(cueBall.body.position.x, cueBall.body.position.y, mouseX, mouseY);
  noStroke(0);
}

function resetCueBall() {
  cueBall.setPosition(cueBallOrigin, table.centerY());
  cueBall.setVelocity(0, 0);
}

function limitBallSpeed(ball, maxSpeed = 30) {
  let vel = ball.velocity();
  let speed = vel.mag();

  if (speed > maxSpeed) {
    vel.normalize().mult(maxSpeed);
    ball.setVelocity(vel.x, vel.y);
  }
}

function setup() {
  createCanvas(1200, 1200, WEBGL);
  matter = Matter.Engine.create();
  matter.world.gravity.y = 0;

  table.boundariesLine();
  table.pocketHoles();
  rackBalls();

  imageMode(CENTER);
  Matter.Runner.run(matter); 
}

function draw() {
  Matter.Engine.update(matter);
  background(255);
  translate(-width / 2, -height / 2);
  image(poolImg, width/2, height/2, poolImg.width*4, poolImg.height*4);  

  // Draw the balls
  balls.forEach((ball) => {
    limitBallSpeed(ball);
    ball.display();
  });

  table.checkPockets();

  // Draw the cue
  if (dragStart) {
    drawCueLine();
  }

  drawDebug();
}