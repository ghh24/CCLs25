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
    // add properties for your dancer here:
    //..
    //..
    //..
    this.color = color(128, 0, 128)
    this.xCor = 0
    this.yCor = 0
    this.numStrands = 70; //amount of hair strands
    this.hairPositions = []; // array for hair strand positions
  }
  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviour
  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.

    push();
    translate(this.x, this.y);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️

    fill(this.color)
    noStroke()

    //main body using circle and rect, bc ellipse wasn't giving the more rounded, full edges for the top and bottom of the shape
    circle(0,20,30)
    rect(-15,-30,30,50)
    circle(0,-30,30)

  
    // right arm
beginShape();
curveVertex(this.xCor + 0, this.yCor - 20);
curveVertex(this.xCor + 0, this.yCor - 20); 

curveVertex(this.xCor + 40, this.yCor - 10); 
curveVertex(this.xCor + 42, this.yCor - 10);
curveVertex(this.xCor + 60, this.yCor - 20); 
curveVertex(this.xCor + 62, this.yCor - 22); 
curveVertex(this.xCor + 64, this.yCor - 18); 
curveVertex(this.xCor + 40, this.yCor - 7); 

curveVertex(this.xCor + 0, this.yCor - 10); 
curveVertex(this.xCor + 0, this.yCor - 10);

endShape();


    // left arm
    beginShape();
    curveVertex(this.xCor - 0, this.yCor - 20); 
    curveVertex(this.xCor - 0, this.yCor - 20); 
    
    curveVertex(this.xCor - 40, this.yCor - 10); 
    curveVertex(this.xCor - 42, this.yCor - 10);
    curveVertex(this.xCor - 60, this.yCor - 20); 
    curveVertex(this.xCor - 62, this.yCor - 22); 
    curveVertex(this.xCor - 64, this.yCor - 18);
    curveVertex(this.xCor - 40, this.yCor - 7); 

    curveVertex(this.xCor - 0, this.yCor - 10); 
    curveVertex(this.xCor - 0, this.yCor - 10);
    
    endShape();

// circle(10,30,5)
// circle(0,55,5)
// circle(10,85,5)



    // right leg
    beginShape();
curveVertex(this.xCor + 15, this.yCor + 20); 
curveVertex(this.xCor + 15, this.yCor + 20); 

curveVertex(this.xCor + 5, this.yCor + 55); 
curveVertex(this.xCor + 5, this.yCor + 57); 
curveVertex(this.xCor + 12, this.yCor + 85); 
curveVertex(this.xCor + 5, this.yCor + 85);
curveVertex(this.xCor + -5, this.yCor + 57); 
curveVertex(this.xCor + -5, this.yCor + 55); 


curveVertex(this.xCor + 5, this.yCor + 30); 
curveVertex(this.xCor + 5, this.yCor + 30); 

endShape();

// left leg
beginShape();
curveVertex(this.xCor + 2, this.yCor + 10);
curveVertex(this.xCor + 2, this.yCor + 10);

curveVertex(this.xCor - 15, this.yCor + 55); 
curveVertex(this.xCor - 15, this.yCor + 57); 
curveVertex(this.xCor - 8, this.yCor + 85); 
curveVertex(this.xCor - 15, this.yCor + 85); 
curveVertex(this.xCor - 25, this.yCor + 57); 
curveVertex(this.xCor - 25, this.yCor + 55);

curveVertex(this.xCor - 5, this.yCor + 10); 
curveVertex(this.xCor - 5, this.yCor + 10); 

endShape();

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

//right eye
  fill(120, 120, 120, 100); 
  noStroke();
  circle(8, -25, 16); 

  fill(180, 180, 180, 150); 
  circle(8, -25, 14);

  fill(240, 240, 240); 
  circle(8, -25, 12); 

  // main outer part of the eye
  fill(255, 255, 255); 
  circle(8, -25, 10);

   // pupil
   fill(100, 50, 255); 
   circle(8, -25, 8.5); 

//left eye
 
   fill(120, 120, 120, 100); 
   noStroke();
   circle(-8.5, -25, 16); 
 
   fill(180, 180, 180, 150);
   circle(-8.5, -25, 14); 
 
   fill(240, 240, 240); 
   circle(-8.5, -25, 12); 
 
   //main outer part of the eye
   fill(255, 255, 255); 
   circle(-8.5, -25, 10); 

    //pupil
  fill(100, 50, 255);
  circle(-8.5, -25, 8.5); 


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