let img;
let imgArray = [];
let f = [];
let f2 = [];
let waimai1;

let mic;
let micLevel = 0;
let cracked = false;

let receiptImg;
let revealProgress = 0;
let unfolding = false;
let receiptVisible = false;
let receiptFullyShown = false;
let crackProgress = 0;
let crackLines = [];

let crackX1 = [];
let crackY1 = [];
let crackX2 = [];
let crackY2 = [];

function preload() {
  img = loadImage("./assets/waimai.jpg");
  receiptImg = loadImage("./assets/receipt.jpg");

  for (let i = 0; i < 5; i++) {
    imgArray[i] = loadImage('./assets/bag' + i + '.jpg'); 
  }
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  waimai1 = new Bags(315, 195);

  mic = new p5.AudioIn();
  mic.start();
  
  textSize(16);
  textStyle(BOLD);
}

let pulseSize = 50;
let pulseDirection = 1;

function draw() {
  background(0);
  image(img, 0, 0, width, height);

  micLevel = mic.getLevel() * 2;

  fill(255, 0, 0);
  noStroke();
  text("Mic Level: " + nf(micLevel, 1, 2), 20, 30);

  waimai1.display();
  waimai1.update();  

  for (let i = 0; i < f.length; i++) {
    f[i].update();
    f[i].display();
  }

  for (let i = 0; i < f2.length; i++) {
    f2[i].update();
    f2[i].display();
  }

  if (mouseIsPressed && mouseX >= 290 && mouseX <= 390 && mouseY >= 175 && mouseY <= 275) {
    for (let i = 0; i < 15; i++) {
      f.push(new Face(img, mouseX, mouseY));
      f2.push(new Face2(img, mouseX, mouseY));
    }
    unfolding = true;
    receiptVisible = true;
  }

  if (mouseX >= 290 && mouseX <= 390 && mouseY >= 175 && mouseY <= 275) {
    noStroke();
    fill(255, 0, 0, 150);
    ellipse(340, 225, pulseSize, pulseSize);
    
    if (pulseSize >= 150 || pulseSize <= 50) {
      pulseDirection = pulseDirection * -1;
    }
    pulseSize = pulseSize + pulseDirection * 2;
  }

  if (unfolding && receiptVisible) {
    revealProgress = revealProgress + 2;
    if (revealProgress >= 400) {
      revealProgress = 400;
      receiptFullyShown = true;
    }
    image(receiptImg, 200, 100, revealProgress, revealProgress);
  }

  if (receiptFullyShown && receiptVisible) {
    if (micLevel > 0.03 && !cracked) {
      cracked = true;
      generateCrackLines();
    }

    if (cracked) {
      crackProgress = crackProgress + 2;
      
      push();
      tint(255, map(crackProgress, 0, 100, 255, 0));
      image(receiptImg, 200, 100, 400, 400);
      pop();
      
      drawCrackLines();
      
      if (crackProgress >= 100) {
        receiptVisible = false;
      }
    }
  }
}

function generateCrackLines() {
  crackX1 = [];
  crackY1 = [];
  crackX2 = [];
  crackY2 = [];
  
  for (let i = 0; i < 5; i++) {
    crackX1[i] = random(200, 600);
    crackY1[i] = random(100, 500);
    crackX2[i] = random(200, 600);
    crackY2[i] = random(100, 500);
  }
}

function drawCrackLines() {
  stroke(255, 100, 100, 200);
  strokeWeight(2);
  
  for (let i = 0; i < crackX1.length; i++) {
    line(crackX1[i], crackY1[i], crackX2[i], crackY2[i]);
  }
}

class Bags {
  constructor(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.clicked = false;
  }
  
  update() {
    if (mouseIsPressed && mouseX >= 290 && mouseX <= 390 && mouseY >= 175 && mouseY <= 275) {
      this.clicked = true;
    }
  }
  
  display() {
    push();
    translate(this.x, this.y);
    if (this.clicked) {
      image(imgArray[0], 0, 0, 40, 60);
    }
    pop();
  }
}

class Face {
  constructor(img, x, y) {
    this.x = x;
    this.y = y;
    this.s = random(20, 100);
    this.speedX = random(-3, 3);
    this.speedY = random(-3, 3);
  }
  
  display() {
    image(imgArray[0], this.x, this.y, this.s, this.s);
  }
  
  update() {
    this.x = this.x + this.speedX;
    this.y = this.y + this.speedY;
  }
}

class Face2 {
  constructor(img, x, y) {
    this.x = x;
    this.y = y;
    this.s = random(20, 100);
    this.speedX = random(-1, 1);
    this.speedY = random(-5, -2);
    this.gravity = 0.3;
  }

  update() {
    this.speedY = this.speedY + this.gravity;
    this.x = this.x + this.speedX;
    this.y = this.y + this.speedY;

    if (this.y > height - this.s) {
      this.y = height - this.s;
      this.speedY = this.speedY * -0.6;
    }
  }

  display() {
    image(imgArray[0], this.x, this.y, this.s, this.s);
  }
}