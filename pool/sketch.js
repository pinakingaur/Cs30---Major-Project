// 8 Ball Pool

let poolImg;
let backgroundIMG;

let matter;  
let balls = [];
let cueBall; 
let aimLine; 
let debugMode = false;
let dragStart;

let hittingEffects;

const ballRadius = 12;
const cueBallOrigin = 1300;
const pocketToBallRatio = 4;
const rim = 40; 

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
  constructor(x, y, name, color) {
    this.name = name;
    this.color = color;
    
    // gives the balls physics
    this.body = Matter.Bodies.circle(x, y, ballRadius, {
      restitution: 0.9,
      friction: 0.01,
      density: 0.01
    });
    Matter.World.add(matter.world, this.body);

    // Rotation state: two independent axes
    this.rollAngle = 0; 
    this.spinAngle = 0; 
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

  updateRotation() {
    let vel = this.velocity();
    let speed = vel.mag();

    if (speed >= 0.05) {
    this.spinAngle += speed / ballRadius;
    }
  }

  // displays the ball
  display() {
    this.updateRotation();

    push();
    translate(this.x(), this.y());
    rotate(this.spinAngle);
    noStroke();

    let number = "";

    // Cue ball
    if (this.name === "cue") {
      fill("white");
      circle(0, 0, ballRadius * 2);
    }

    // 8-ball
    else if (this.name === "8") {
      fill("black");
      circle(0, 0, ballRadius * 2);
      number = "8";
    }

    // Solids
    else if (this.name.startsWith("solid-")) {
      fill(this.color);
      circle(0, 0, ballRadius * 2);
      number = this.name.split("-")[1];
    }

    // Stripes
    else if (this.name.startsWith("stripe-")) {
      fill("white");
      circle(0, 0, ballRadius * 2);

      fill(this.color);
      rectMode(CENTER);
      rect(0, 0, ballRadius * 2, ballRadius * 0.8, ballRadius * 0.3);

      number = this.name.split("-")[1];
    }

    // Number label — offset from center so rotation is visually apparent
    if (number !== "") {
      const labelOffset = ballRadius * 0.35;
      fill("white");
      circle(labelOffset, 0, ballRadius * 0.9);

      fill("black");

      if (number.length === 2) {
        textSize(8);
      } else {
        textSize(10);
      }
      text(number, labelOffset, 0);
    }
    pop();
  }
}


function preload() {
  poolImg = loadImage("table.jpg");
  backgroundIMG = loadImage("background.png");

  soundFormats('mp3', 'ogg');
  // hittingEffects = loadSound('/assets/doorbell');
}

function keyPressed() {
  if (key === "d") {
    debugMode =! debugMode;
    // hittingEffects.play();
  }
}

function mousePressed() {
  if (!cueBall) return;

  // Don't allow shooting while cue ball is moving
  if (!cueBallStopped()) return;

  let nearCueBall = dist(mouseX, mouseY, cueBall.body.position.x, cueBall.body.position.y) <= ballRadius * 2;
  
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
  let cuePos = createVector(cueBall.body.position.x, cueBall.body.position.y);

  let mousePos = createVector(mouseX, mouseY);

  // Direction from cue ball to mouse
  let dir = p5.Vector.sub(mousePos, cuePos);
  dir.normalize();

  // Start line at edge of ball
  let startX = cuePos.x + dir.x * ballRadius;
  let startY = cuePos.y + dir.y * ballRadius;

  stroke("violet");
  strokeWeight(6);

  line(startX, startY, mousePos.x, mousePos.y);
  noStroke();
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
  createCanvas(1910, 950, WEBGL);

  textAlign(CENTER, CENTER);
  textFont("Arial");

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
  
  background(0);
  image(backgroundIMG, 0, 0, width, height);
  
  translate(-width / 2, -height / 2);
  image(poolImg, width/2, height/2, poolImg.width * 2, poolImg.height * 2); 

  // Draw the balls
  balls.forEach((ball) => {
    limitBallSpeed(ball);
    ball.display();
  });

  table.checkPockets();

  // Draw the cue
  if (dragStart && cueBallStopped()) {
    drawCueLine();
  }
  drawDebug();
}

const table = {
  left: 397, 
  top: 175,
  right: 1470,
  bottom: 725,
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
      createVector(415, 205),  //top - left pocket
      createVector(948, 185), //top - middle pocket
      createVector(1485, 204), //top - right pocket
      createVector(418, 745), //bottom - left pocket
      createVector(950, 755), //bottom - middle pocket  
      createVector(1485, 745), //bottom - right pocket
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

function rackBalls() {
  // draws the cue ball
  cueBall = new Ball(cueBallOrigin, table.centerY(), "cue", "white");
  balls.push(cueBall);

  // draws the pool balls in a triangle
  const footSpotX = 700;
  const spacing = 2 * ballRadius + 3;
  const xOffset = sqrt(3) * ballRadius;

  const colors = [
    "yellow",
    "blue",
    "red",
    "purple",
    "orange",
    "lightgreen",
    "brown"
  ];

  let ballNumber = 1;
  let rowLength = 1;

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < rowLength; col++) {

      let xPos = footSpotX - row * xOffset;
      let yPos = table.centerY() - (rowLength - 1) * ballRadius + col * spacing;

      let ball;

      // 8-ball in center
      if (row === 2 && col === 1) {
        ball = new Ball(xPos, yPos, "8", "black");
      }
      else {
        let color;

        if (ballNumber <= 7) {
          // Solids (1-7)
          color = colors[ballNumber - 1];
          ball = new Ball(xPos, yPos, `solid-${ballNumber}`, color);
        }
        else {
          // Stripes (9-15)
          color = colors[(ballNumber - 8) % 7];
          ball = new Ball(xPos, yPos, `stripe-${ballNumber + 1}`, color);
        }
        ballNumber++;
      }
      balls.push(ball);
    }
    rowLength++;
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

function cueBallStopped() {
  return cueBall.velocity().mag() < 0.1;
}