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

// For smoothing mic input
let micSmoothing = 0;
const SMOOTHING_FACTOR = 0.8;

function preload() {
  img = loadImage("./assets/waimai.jpg");
  receiptImg = loadImage("./assets/receipt.jpg");

  for (let i = 0; i < 5; i++) {
    imgArray[i] = loadImage('./assets/' + 'bag' + i + '.jpg'); 
  }
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  waimai1 = new Bags(315,195);

  // Initialize the mic with better setup
  mic = new p5.AudioIn();
  userStartAudio(); //automatically indicates that user wants to interact with the page to activate microphone, set it automatically 
  mic.start(function() {
    console.log("Mic ready");
  }, function(err) {
    console.error("Mic error:", err);
  });
  
  // Set text properties once
  textSize(16);
  textStyle(BOLD);
}

let pulseSize = 50;
let pulseDirection = 1;
let maxPulseSize = 150;
let minPulseSize = 50;
let circleVisible = true;

function draw() {
  background(0);
  image(img, 0, 0, width, height);

  // Get and smooth mic level
  let rawLevel = mic.getLevel();
  console.log("r", rawLevel)
  micSmoothing = SMOOTHING_FACTOR * micSmoothing + (1 - SMOOTHING_FACTOR) * rawLevel;
  micLevel = micSmoothing * 2; // Amplify slightly
  
  // Display debug info in red
  fill(255, 0, 0); // Red color
  noStroke();
  text("Mic Level: " + nf(micLevel, 1, 2), 20, 30);
  text("Crack Progress: " + crackProgress, 20, 50);
  text("Status: " + 
       (unfolding ? (receiptFullyShown ? "Waiting for sound..." : "Unfolding...") : 
       (receiptVisible ? "Ready to crack!" : "Click bag to start")), 20, 70);

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

  if (mouseIsPressed &&
      mouseX >= 290 && mouseX <= 390 &&
      mouseY >= 175 && mouseY <= 275) {
    for (let i = 0; i < 15; i++) {
      f.push(new Face(img, mouseX, mouseY));
      f2.push(new Face2(img, mouseX, mouseY));
    }
    circleVisible = false;
    unfolding = true;
    receiptVisible = true;
  }

  if (circleVisible && mouseX >= 290 && mouseX <= 390 && mouseY >= 175 && mouseY <= 275) {
    noStroke();
    fill(255, 0, 0, 150);
    ellipse(340, 225, pulseSize, pulseSize);
  }

  if (pulseSize >= maxPulseSize || pulseSize <= minPulseSize) {
    pulseDirection *= -1;
  }
  pulseSize += pulseDirection * 4;

  // Unfold the receipt
  if (unfolding && receiptVisible) {
    revealProgress += 2;
    if (revealProgress >= width) {
      revealProgress = width;
      receiptFullyShown = true;
    }
    image(receiptImg, 200, 100, revealProgress, revealProgress);
  }

  // After receipt is fully shown
  if (receiptFullyShown && receiptVisible) {
    // Check for loud sound (threshold may need adjustment)
    if (micLevel > 0.03 && !cracked) {
      cracked = true;
      generateCrackLines();
    }

    // If cracked, animate the cracking
    if (cracked) {
      crackProgress += 2;
      
      // Draw receipt with cracks
      push();
      tint(255, map(crackProgress, 0, 100, 255, 0));
      image(receiptImg, 200, 100, width, height);
      pop();
      
      // Draw crack lines in bright red
      drawCrackLines();
      
      // Hide receipt when fully cracked
      if (crackProgress >= 100) {
        receiptVisible = false;
      }
    }
  }
}

function generateCrackLines() {
  crackLines = [];
  // Create more dramatic cracks
  for (let i = 0; i < 8; i++) { // Increased from 5 to 8 cracks
    crackLines.push({
      x1: random(width),
      y1: random(height),
      x2: random(width),
      y2: random(height),
      branches: []
    });
    
    // Add more branches to main cracks
    for (let j = 0; j < 5; j++) { // Increased from 3 to 5 branches
      crackLines[i].branches.push({
        x1: crackLines[i].x2,
        y1: crackLines[i].y2,
        x2: crackLines[i].x2 + random(-100, 100),
        y2: crackLines[i].y2 + random(-100, 100)
      });
    }
  }
}

function drawCrackLines() {
  let alpha = map(crackProgress, 0, 100, 50, 255); // Start more visible
  stroke(255, 100, 100, alpha); // Bright red color
  strokeWeight(3); // Thicker lines
  noFill();
  
  for (let line of crackLines) {
    // Draw main crack
    line(line.x1, line.y1, line.x2, line.y2);
    
    // Draw branches
    for (let branch of line.branches) {
      line(branch.x1, branch.y1, branch.x2, branch.y2);
      
      // Add secondary branches for more drama
      if (random() > 0.7) {
        line(branch.x2, branch.y2, 
             branch.x2 + random(-50, 50), 
             branch.y2 + random(-50, 50));
      }
    }
  }
}

// ... (rest of your classes remain the same)

// Rest of your classes remain the same...
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
    this.img = imgArray[0];
    this.speedX = random(-3, 3);
    this.speedY = random(-3, 3);
  }
  display() {
    image(this.img, this.x, this.y, this.s, this.s);
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

class Face2 {
  constructor(img, x, y) {
    this.x = x;
    this.y = y;
    this.s = random(20, 100);
    this.img = imgArray[0];
    this.speedX = random(-1, 1);
    this.speedY = random(-5, -2);
    this.gravity = 0.3;
    this.bounceFactor = 0.6;
    this.ground = height - this.s;
  }

  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.y > this.ground) {
      this.y = this.ground;
      this.speedY *= -this.bounceFactor;
      this.speedX *= 0.95;
      if (abs(this.speedY) < 1) {
        this.speedY = 0;
        this.speedX = 0;
      }
    }
  }

  display() {
    image(this.img, this.x, this.y, this.s, this.s);
  }
}