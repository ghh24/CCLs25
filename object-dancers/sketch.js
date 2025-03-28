/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new Flubble(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class Flubble {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.color = color(128, 0, 128);
    this.numStrands = 70;
    this.hairPositions = [];

    this.angleRightArm = 0;
    this.angleLeftArm = 0;

    this.angleRightLeg = 0;
    this.angleLeftLeg = 0;

    this.pupilX = 5;
    this.pupilY = 0;

    this.directionFactor = 1; 
  }

  update() {
    // arm to move around
    this.angleRightArm = sin(frameCount * 0.05) * PI / 4;
    this.angleLeftArm = -sin(frameCount * 0.05) * PI / 4;

    this.angleRightLeg = sin(frameCount * 0.1) * PI / 8;
    this.angleLeftLeg = -sin(frameCount * 0.1) * PI / 8;

    this.rightPupilX = 8 + sin(frameCount * 0.1) * 4;
    this.rightPupilY = -25 + cos(frameCount * 0.1) * 4;

    this.leftPupilX = -8.5 + sin(frameCount * 0.1) * 4;
    this.leftPupilY = -25 + cos(frameCount * 0.1) * 4;
  }

  display() {
// the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.

    push();
    translate(this.x, this.y);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️

    //move back and forth for running 
    let runShift = sin(frameCount * 0.05) * 20 * this.directionFactor;
    translate(runShift, 0);  

    // switch direction if reaches specified range
    if (abs(runShift) > 18) {  
      this.directionFactor *= -1;  
    }

    fill(this.color);
    noStroke();

        //main body using circle and rect, bc ellipse wasn't giving the more rounded, full edges for the top and bottom of the shape

    circle(0, 20, 30);
    rect(-15, -30, 30, 50);
    circle(0, -30, 30);

    // left arm
    push();
    translate(0, -10);  
    translate(0, -20);
    rotate(this.angleRightArm);
    beginShape();
    curveVertex(0, -20);
    curveVertex(0, -20);
    curveVertex(40 * this.directionFactor, -10);
    curveVertex(42 * this.directionFactor, -10);
    curveVertex(60 * this.directionFactor, -20);
    curveVertex(62 * this.directionFactor, -22);
    curveVertex(64 * this.directionFactor, -18);
    curveVertex(40 * this.directionFactor, -7);
    curveVertex(0, -10);
    curveVertex(0, -10);
    endShape();
    pop();

    //aleft arm
    push();
    translate(0, -10);  
    translate(0, -20); 
    rotate(this.angleLeftArm);
    beginShape();
    curveVertex(0, -20);
    curveVertex(0, -20);
    curveVertex(-40 * this.directionFactor, -10);
    curveVertex(-42 * this.directionFactor, -10);
    curveVertex(-60 * this.directionFactor, -20);
    curveVertex(-62 * this.directionFactor, -22);
    curveVertex(-64 * this.directionFactor, -18);
    curveVertex(-40 * this.directionFactor, -7);
    curveVertex(0, -10);
    curveVertex(0, -10);
    endShape();
    pop();


    // circle(10,30,5)
// circle(0,55,5)
// circle(10,85,5)

    //right leg
    push();
    translate(0, 30);  
    translate(0, -20);  
    rotate(this.angleRightLeg);
    beginShape();
    curveVertex(15 * this.directionFactor, 20);
    curveVertex(15 * this.directionFactor, 20);
    curveVertex(5 * this.directionFactor, 55);
    curveVertex(5 * this.directionFactor, 57);
    curveVertex(12 * this.directionFactor, 85);
    curveVertex(5 * this.directionFactor, 85);
    curveVertex(-5 * this.directionFactor, 57);
    curveVertex(-5 * this.directionFactor, 55);
    curveVertex(5 * this.directionFactor, 30);
    curveVertex(5 * this.directionFactor, 30);
    endShape();
    pop();

    // left leg
    push();
    translate(0, 30); 
    translate(0, -20);  
    rotate(this.angleLeftLeg);
    beginShape();
    curveVertex(2 * this.directionFactor, 10);
    curveVertex(2 * this.directionFactor, 10);
    curveVertex(-15 * this.directionFactor, 55);
    curveVertex(-15 * this.directionFactor, 57);
    curveVertex(-8 * this.directionFactor, 85);
    curveVertex(-15 * this.directionFactor, 85);
    curveVertex(-25 * this.directionFactor, 57);
    curveVertex(-25 * this.directionFactor, 55);
    curveVertex(-5 * this.directionFactor, 10);
    curveVertex(-5 * this.directionFactor, 10);
    endShape();
    pop();
//hair
stroke(0, 191, 255); 
for (let i = 0; i < this.numStrands; i++) {
  let xPos = random(-15, 15); 
  let yPos = random(-40, -35);
  // curve/bend hair strands
  beginShape();
  let controlPointX = random(-10, 10); 
  let controlPointY = random(-5, -10);

  // hair first bend
  vertex(xPos, yPos); 
  vertex(xPos + controlPointX, yPos + controlPointY); 

  //hair second bend
  controlPointX = random(-10, 10);
  controlPointY = random(-5, -10);
  vertex(xPos + controlPointX * 2, yPos + controlPointY * 2); 
  endShape();
}

 // right eye
 fill(120, 120, 120, 100);
 noStroke();
 circle(this.rightPupilX, this.rightPupilY, 16); 

 fill(180, 180, 180, 150);
 circle(this.rightPupilX, this.rightPupilY, 14);

 fill(240, 240, 240);
 circle(this.rightPupilX, this.rightPupilY, 12);

 fill(255, 255, 255);
 circle(this.rightPupilX, this.rightPupilY, 10);

 // right pupil inner blue color
 fill(100, 50, 255);
 circle(this.rightPupilX, this.rightPupilY, 8.5);

 // left eye
 fill(120, 120, 120, 100);
 noStroke();
 circle(this.leftPupilX, this.leftPupilY, 16);

 fill(180, 180, 180, 150);
 circle(this.leftPupilX, this.leftPupilY, 14);

 fill(240, 240, 240);
 circle(this.leftPupilX, this.leftPupilY, 12);

 fill(255, 255, 255);
 circle(this.leftPupilX, this.leftPupilY, 10);

 // left inner pupil blue color
 fill(100, 50, 255);
 circle(this.leftPupilX, this.leftPupilY, 8.5);


  //lips
  
 fill(255, 0, 127); 
 noStroke();  
 ellipse(0, -15, 18, 10);  
 fill(0);
 ellipse(0, -15, 6, 3);  



    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    this.drawReferenceShapes()

    pop();
  }
  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/