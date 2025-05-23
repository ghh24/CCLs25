let snowflakes = [];
let n = 100;
let bgImg;

function preload() {
  bgImg = loadImage("assets/cabin.jpg");
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");


  for (let i = 0; i < n; i++) {
    snowflakes[i] = new Snowflake();
  }
}

function draw() {
  image(bgImg, 0, 0, width, height);
  for (let i = 0; i < snowflakes.length; i++) {
    snowflakes[i].display();
    snowflakes[i].move();
    snowflakes[i].checkBoundaries();
  }
}

class Snowflake {
  constructor() {
    this.x = random(width);
    this.y = random(-height, 0);
    this.s = random(7, 15);
    this.yspeed = map(this.s, 2, 8, 0.5, 2);
    this.xdrift = random(-0.3, 0.3);
    this.angle = random(TWO_PI);
    this.rotationSpeed = random(-0.02, 0.02);
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    noStroke();
    fill(255, 255, 255, 200);

    for (let i = 0; i < 6; i++) {
      rotate(PI / 3);
      ellipse(0, this.s * 0.3, this.s * 0.2, this.s);
      ellipse(this.s * 0.3, this.s * 0.3, this.s * 0.15, this.s * 0.5);
      triangle(this.s * 0.3, this.s * 0.3,
        this.s * 0.15, this.s * 0.5,
        this.s * 0.45, this.s * 0.5); 
      ellipse(-this.s * 0.3, this.s * 0.3, this.s * 0.15, this.s * 0.5);
      ellipse(this.s * 0.6, this.s * 0.3, this.s * 0.35, this.s * 0.5);
      ellipse(-this.s * 0.6, -this.s * 0.3, this.s * 0.35, this.s * 0.5);


    }

    pop();
  }

  move() {
    this.y += this.yspeed;
    this.x += this.xdrift;
    this.angle += this.rotationSpeed;

    this.xdrift += random(-0.05, 0.05);
    this.xdrift = constrain(this.xdrift, -0.5, 0.5);
  }

  checkBoundaries() {
    if (this.y > height + this.s) {
      this.x = random(width);
      this.y = random(-this.s, -10);
      this.xdrift = random(-0.3, 0.3);
    }
    if (this.x > width + this.s) this.x = -this.s;
    if (this.x < -this.s) this.x = width + this.s;
  }
}