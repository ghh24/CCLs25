var img;
var imgArray = [];
var receiptArray = [];
var compartments = [];
var handPose;
var hands = [];
var video;
var PINCH_DISTANCE = 50;
var collectedBags = [];
var zoomedBag = null;
var lastPinchTime = 0;
var PINCH_COOLDOWN = 1000;
var longPressStart = 0;
var LONG_PRESS_DURATION = 1000;
var showMessage = false;
var messageTimer = 0;
var MESSAGE_DURATION = 5000;
var messageAlpha = 0;

function preload() {
  img = loadImage("./assets/waimai.jpg");
  
  for (var i = 0; i < 8; i++) {
    imgArray[i] = loadImage('./assets/bag' + i + '.jpg');
    receiptArray[i] = loadImage('./assets/receipt' + i + '.jpg');
  }
  
  handPose = ml5.handPose();
}

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");  
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  
  handPose.detectStart(video, gotHands);
  
  compartments.push(new Compartment(width * 0, height * 0, 0.01));
  compartments.push(new Compartment(width * 0.4, height * 0.25, 1));
  compartments.push(new Compartment(width * 0.6, height * 0.3, 2));
  compartments.push(new Compartment(width * 0.8, height * 0.28, 3));
  compartments.push(new Compartment(width * 0.15, height * 0.6, 4));
  compartments.push(new Compartment(width * 0.35, height * 0.65, 5));
  compartments.push(new Compartment(width * 0.65, height * 0.62, 6));
  compartments.push(new Compartment(width * 0.85, height * 0.6, 7));
}

function draw() {
  image(img, 0, 0, width, height);

  for (var i = 0; i < compartments.length; i++) {
    compartments[i].display();
  }

  drawCollectedBags();

  if (zoomedBag) {
    zoomedBag.display();
    if (millis() - zoomedBag.startTime > 5000) {
      zoomedBag = null;
    }
  }

  drawHandTracking();

  if (showMessage) {
    drawMessage();
    if (millis() - messageTimer > MESSAGE_DURATION) {
      showMessage = false;
      messageAlpha = 0;
    }
  }
}

function drawCollectedBags() {
  for (var i = 0; i < collectedBags.length; i++) {
    var bag = collectedBags[i];
    
    if (bag.scale < 1) {
      bag.scale = min(1, bag.scale + 0.05);
    }
    
    var pulse = 1 + sin(frameCount * 0.05 + i) * 0.03;
    
    push();
    translate(bag.x, bag.y);
    scale(bag.scale * pulse);
    rotate(radians(bag.rotation));
    image(bag.img, 0, 0, bag.width, bag.height);
    pop();
  }
}

function drawHandTracking() {
  if (hands.length > 0) {
    var indexTip = hands[0].index_finger_tip;
    var thumbTip = hands[0].thumb_tip;

    var indexX = indexTip.x * (width / video.width);
    var indexY = indexTip.y * (height / video.height);
    var thumbX = thumbTip.x * (width / video.width);
    var thumbY = thumbTip.y * (height / video.height);

    drawGlow(indexX, indexY);
    drawGlow(thumbX, thumbY);

    fill(255, 209, 0, 180);
    circle(indexX, indexY, 8);
    circle(thumbX, thumbY, 8);

    var pinchDistance = dist(indexX, indexY, thumbX, thumbY);
    if (pinchDistance < PINCH_DISTANCE) {
      var centerX = (indexX + thumbX) / 2;
      var centerY = (indexY + thumbY) / 2;
      var diameter = map(pinchDistance, 0, PINCH_DISTANCE, 50, 5);
      fill(255, 100, 0, 120);
      circle(centerX, centerY, diameter);
    }
  }
}

function drawGlow(x, y) {
  var baseRadius = 18 + sin(frameCount * 0.045) * 2;
  noStroke();
  for (var i = 20; i > 0; i--) {
    var alpha = map(i, 20, 1, 0, 60);
    var r = baseRadius + i * 1.8;
    fill(255, 209, 0, alpha);
    ellipse(x, y, r, r);
  }
}

function drawMessage() {
  messageAlpha = min(255, messageAlpha + 5);
  
  fill(0, messageAlpha * 0.6);
  rect(0, 0, width, height);
  
  var boxScale = map(messageAlpha, 0, 255, 0.8, 1);
  var boxWidth = width * 0.7 * boxScale;
  var boxHeight = height * 0.5 * boxScale;
  
  fill(255, messageAlpha);
  drawingContext.shadowBlur = 20 * boxScale;
  drawingContext.shadowColor = color(255, 255, 255, messageAlpha * 0.7);
  rect(width/2 - boxWidth/2, height/2 - boxHeight/2, boxWidth, boxHeight);
  drawingContext.shadowBlur = 0;
  
  fill(0, messageAlpha);
  textSize(24 * boxScale);
  textAlign(CENTER, CENTER);
  text("In a world of instant gratification, we\ncommodify both nourishment and experience-\nthis project explores how what we consume\nstays with us, not in substance, but in memory,\nclutter, and trace.", 
       width/2, height/2);
}

function mousePressed() {
  longPressStart = millis();
}

function mouseReleased() {
  if (millis() - longPressStart >= LONG_PRESS_DURATION) {
    collectedBags = [];
    showMessage = true;
    messageTimer = millis();
    messageAlpha = 0;
  }
  
  if (zoomedBag && zoomedBag.isCloseButtonClicked(mouseX, mouseY)) {
    zoomedBag = null;
  }
}

function gotHands(results) {
  hands = results;
  
  if (hands.length > 0 && millis() - lastPinchTime > PINCH_COOLDOWN) {
    var indexTip = hands[0].index_finger_tip;
    var thumbTip = hands[0].thumb_tip;
    
    var indexX = indexTip.x * (width / video.width);
    var indexY = indexTip.y * (height / video.height);
    var thumbX = thumbTip.x * (width / video.width);
    var thumbY = thumbTip.y * (height / video.height);
    
    var pinchDist = dist(indexX, indexY, thumbX, thumbY);
    if (pinchDist < PINCH_DISTANCE) {
      var pinchCenterX = (indexX + thumbX) / 2;
      var pinchCenterY = (indexY + thumbY) / 2;
      
      for (var i = 0; i < compartments.length; i++) {
        var compartment = compartments[i];
        if (compartment.isPointInside(pinchCenterX, pinchCenterY)) {
          var newBag = {};
newBag.img = imgArray[compartment.index];
newBag.x = random(width * 0.1, width * 0.9);
newBag.y = random(height * 0.1, height * 0.9);
newBag.width = random(120, 180);
newBag.height = random(150, 210);
newBag.rotation = random(-15, 15);
newBag.scale = 0;

          collectedBags.push(newBag);
          
          zoomedBag = new ZoomedBag(
            imgArray[compartment.index],
            receiptArray[compartment.index]
          );
          
          lastPinchTime = millis();
          break;
        }
      }
    }
  }
}

function Compartment(x, y, index) {
  this.x = x;
  this.y = y;
  this.index = index;
  this.regionWidth = 80;
  this.regionHeight = 80;
  
  this.isPointInside = function(x, y) {
    return x > this.x - this.regionWidth/2 &&
           x < this.x + this.regionWidth/2 &&
           y > this.y - this.regionHeight/2 &&
           y < this.y + this.regionHeight/2;
  };
  
  this.display = function() {
    noFill();
    stroke(255, 0, 0);
    rect(this.x - this.regionWidth/2, this.y - this.regionHeight/2, 
         this.regionWidth, this.regionHeight);
  };
}

function ZoomedBag(bagImg, receiptImg) {
  this.bagImg = bagImg;
  this.receiptImg = receiptImg;
  this.startTime = millis();
  this.animationProgress = 0;
  this.targetWidth = min(width, height) * 0.6;
  this.targetHeight = this.targetWidth * 1.3;
  
  this.closeButtonX = width - 50;
  this.closeButtonY = 50;
  this.closeButtonW = 30;
  this.closeButtonH = 30;
  
  this.isCloseButtonClicked = function(x, y) {
    return x > this.closeButtonX && 
           x < this.closeButtonX + this.closeButtonW &&
           y > this.closeButtonY && 
           y < this.closeButtonY + this.closeButtonH;
  };
  
  this.display = function() {
    this.animationProgress = min(1, (millis() - this.startTime) / 300);
    var easedProgress = easeInOutQuad(this.animationProgress);
    
    fill(0, map(easedProgress, 0, 1, 0, 150));
    noStroke();
    rect(0, 0, width, height);
    
    var elasticProgress = elasticOut(this.animationProgress);
    var currentWidth = this.targetWidth * elasticProgress;
    var currentHeight = this.targetHeight * elasticProgress;
    
    var bagX = width/2 - currentWidth/2;
    var bagY = height/2 - currentHeight/2;
    image(this.bagImg, bagX, bagY, currentWidth, currentHeight);
    
    var receiptProgress = min(1, (millis() - this.startTime - 100) / 300);
    var receiptEased = easeInOutQuad(receiptProgress);
    var receiptWidth = this.targetWidth * 0.45 * receiptEased;
    var receiptHeight = receiptWidth * 3.1;
    image(this.receiptImg, width/2 + currentWidth/2 + 20, 
          height/2 - receiptHeight/2, receiptWidth, receiptHeight);
    
    fill(255, 100, 100, 255 * easedProgress);
    rect(this.closeButtonX, this.closeButtonY, this.closeButtonW, this.closeButtonH);
    fill(255, 255 * easedProgress);
    textSize(20);
    text("X", this.closeButtonX + 10, this.closeButtonY + 20);
  };
}

function easeInOutQuad(t) {
  if (t < 0.5) {
    return 2 * t * t;
  } else {
    return -1 + (4 - 2 * t) * t;
  }
}

function elasticOut(t) {
  var p = 0.3;
  return Math.pow(2, -10 * t) * Math.sin((t - p/4) * (2 * Math.PI) / p) + 1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(width, height);
}