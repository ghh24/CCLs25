let img; //background meituan cabinet image
let imgArray=[]; //bag images
 let receiptArray =[]; 
let compartments =[]; //red outline boxes

let handPose; //ml5 
let hands=[];
 let video;

let PINCH_DISTANCE=60;
  let PINCH_CLOSE_DISTANCE = 40;
    let collectedBags = [];
let zoomedBag= null;
let lastPinchTime= 0;

 let PINCH_COOLDOWN= 800; //min time btw pinches
 let PINCH_HOLD_TIME =1000; //required length of time for pinch to close the bag
  let pinchStartTime = 0;

 let isPinchingToClose = false; //is there a pinch or not
  let longPressStart = 0;

 let LONG_PRESS_DURATION =1000;

let showMessage = false; //show project message
let messageTimer = 0;

   let MESSAGE_DURATION = 5000;
let messageAlpha = 0;
let showDiscardMessage =false;
 let discardMessageAlpha =0; //discard text on bags
let plantImg;
let plantImg2;

//notificaio & guy face images
let notifImg; 
   let guyImages = []; 
let textNotifs = []; 
 let currentNotifStage = 0;
let notifY = -200; 

let notifTimer = 0;
 let currentGuyImage =null;
let currentTextNotif =null;

// cabinet variables
let closedCabImg;
let openCabImg;
   let cabinetIsOpen =false;
let cabinetOpeningTime = 0;
 let CABINET_OPEN_DURATION = 800;
 
let bgMusic;


function preload()    {
  img = loadImage("./assets/waimai.jpg");
    bgMusic = loadSound('./assets/background.mp3');

  
  for (let i = 0; i < 8; i++) {
    imgArray[i] = loadImage('./assets/bag' + i + '.jpg');
    receiptArray[i] = loadImage('./assets/receipt' + i + '.jpg');
  }
  
  closedCabImg = loadImage('./assets/closedcab.jpg');
  openCabImg = loadImage('./assets/opencab.jpg');
   plantImg = loadImage('./assets/plant.jpg');

  plantImg2 = loadImage('./assets/plant2.jpg') ;

  notifImg = loadImage('assets/notif.png')   ;
  
  guyImages[0] = loadImage('assets/guylook.png');
  guyImages[1] = loadImage('assets/guysmile.png') ;
  
  textNotifs[0] = loadImage( 'assets/boxnotif.png');

   textNotifs[1] = loadImage('assets/pinchnotif.png' ) ;
  textNotifs[2] = loadImage('assets/clutternotif.png') ;

  handPose = ml5.handPose() ;

  
}

function setup() {
  let canvas = createCanvas(windowWidth,windowHeight);
  canvas.parent("p5-canvas-container");  

  bgMusic.setVolume(0.5); 
  //bgMusic.loop(); 
   video = createCapture(VIDEO);
  video.size(width,height);
    //video.size(640,480);


  video.hide();
  
  handPose.detectStart(video, gotHands);
//start audio button html ish
startButton = createButton('Start Audio' );
startButton.position(width / 2 -50, height/ 2);

startButton.style('font-size','20px');

startButton.style('background-color','#ffffff');

startButton.style('color', '#000000');
  startButton.style('padding','10px 20px');
 startButton.style('z-index', '1000');
startButton.style('position','absolute');

startButton.parent("p5-canvas-container"); 
startButton.mousePressed(() => {
  bgMusic.loop();
  startButton.hide();
});
//console.log("Button created:", startButton); 
  
  compartments.push(new Compartment(width * 0.671, height * 0.25, 0, 120, 100));
  compartments.push(new Compartment(width * 0.78, height * 0.25, 1, 120,100));

   compartments.push(new Compartment(width * 0.78, height * 0.64, 2, 120,80));
  compartments.push(new Compartment(width * 0.888, height * 0.79, 3, 120,80));

  compartments.push(new Compartment(width * 0.222, height * 0.25, 4, 120,100));
   compartments.push(new Compartment(width * 0.222, height * 0.46, 5, 120,100));
   compartments.push(new Compartment(width * 0.341, height * 0.46, 6, 120,100));

  compartments.push(new Compartment(width * 0.341, height * 0.793, 7, 120,79));

startNotificationCycle(); // box, notif, and pinch 
}

function draw() {
  image(img, 0, 0, width, height);
  drawCabinet();

//makes each compartment
  for (let i = 0; i <compartments.length;i++) {
    compartments[i].display();
  }

  //for the notifcations
   updateNotifications();
  drawNotifications();

  //the remnant bags
  drawCollectedBags();

  //if pinched then bags zoom in
  if (zoomedBag) {
    zoomedBag.display();
    if (isPinchingToClose) {

       let progress = constrain(map(millis()-pinchStartTime, 0,PINCH_HOLD_TIME, 0, 1), 0, 1);
      drawClosingFeedback(progress);
    }
  }

  drawHandTracking();
   drawDiscardMessage();

  //to show message then message box and text is created
  if (showMessage) {
    drawMessage();
    if (millis() - messageTimer>MESSAGE_DURATION) {
       showMessage = false;
       messageAlpha = 0;
    }
  }

  fill(255);
  text(`Hands detected: ${hands.length}`, 20, 20);
  text(`Video ready: ${video?.loadedmetadata}`, 20, 40);
  text(`Model ready: ${handPose?.modelReady}`, 20, 60);
  
  // Temporary: Draw raw video
  image(video, 0, 0, 200, 150);
}
//remnant cabinet
function drawCabinet() {
  let cabWidth = width * 0.18;
   let cabHeight =cabWidth 
   * (closedCabImg.height/closedCabImg.width) * 0.9;
  let cabX = width * 0.02;

  let cabY = height - cabHeight - 20;
  
//for plants
  let plantWidth = cabWidth * 0.45;
      let plantHeight = plantWidth * (plantImg.height/plantImg.width);
  let plantX = cabX + cabWidth/2 - plantWidth/2;

  let plantY = cabY - plantHeight * 0.8; 
  
//different code for open & closed cabinet
  if (cabinetIsOpen) {

    image(openCabImg, cabX,cabY, cabWidth, cabHeight);
    
    // bags fly into cabinet
    if (millis() -cabinetOpeningTime <CABINET_OPEN_DURATION) {
      let progress = (millis()- cabinetOpeningTime) /CABINET_OPEN_DURATION;
      
      for (let i = 0; i< collectedBags.length;i++) {
        let bag = collectedBags[i];
        let targetX = cabX + cabWidth/2;

             let targetY = cabY + cabHeight * 0.7;
        
        let currentX=bag.x  + (targetX - bag.x) * progress;
         let currentY= bag.y + ( targetY -bag.y) *progress;
        let currentScale = bag.scale - (bag.scale- 0.3) *progress;
        
        push();
              translate(currentX, currentY);

         scale(currentScale );

        rotate(radians(bag.rotation));
         image(bag.img, 0, 0,  bag.width , bag.height);
        pop();
      }
    }
  } else {
    image(closedCabImg, cabX, cabY, cabWidth, cabHeight);
    
    //  remnant text
    fill(255,150);
     noStroke();
    textSize(24 );
     
     textAlign(CENTER, CENTER);

    text("remnants", cabX + cabWidth/2 + 34, cabY + cabHeight/2 - 7);
  }
  
//plants images positions
  image(plantImg, plantX-40, plantY, plantWidth, plantHeight);
   image(plantImg2, plantX+20, plantY+18, plantWidth+40, plantHeight+40);

}
 
//discard
function drawDiscardMessage() {
  if (showDiscardMessage) {

    if ( discardMessageAlpha<255) {

      discardMessageAlpha = discardMessageAlpha +15;
    }

  } else {
    if (discardMessageAlpha > 0) {
       discardMessageAlpha = 
       discardMessageAlpha - 15;
    }
  }
  
  if (discardMessageAlpha > 0) {
     let centerX = width/2;

    let centerY = height/2 + 120;

    
     fill(255, 100, 100,  discardMessageAlpha);
    noStroke();

     textSize(20);
       textAlign(CENTER, CENTER);
    text("Discarding...", centerX, centerY);
  }
}

//shrinking & growing circle based on pinch
function drawClosingFeedback(progress) {
  let centerX =  width/2;
       let centerY = height/ 2;
  let circleSize = map( progress, 0, 1, 50, 200);
  
   noFill();
   stroke(255, 100, 100, 200 * progress);
        strokeWeight(3);

  ellipse(centerX, centerY, circleSize, circleSize);
}

//remnant bags on screen scaling & pulsing
function drawCollectedBags () {
    for (let i = 0; i < collectedBags.length; i++) {

    let bag = collectedBags[i];
    
         if (bag.scale < 1) {
      bag.scale = min(1, bag.scale +0.05);
    }
    
     let pulse = 1 + sin(frameCount *0.05 + i) *0.03;
    
    push();
       translate( bag.x,bag.y);
    scale(bag.scale * pulse);

     rotate(radians( bag.rotation));
    image(bag.img, 0,0,bag.width,bag.height);

    pop();
  }
}
 

//glowing indications for fingers & pinch detect
function drawHandTracking() {
  if (hands.length > 0) {
    let indexTip  = hands[0].index_finger_tip; 
     
     let thumbTip = hands[0] .thumb_tip;

    let indexX = indexTip.x * (width / video.width);
           let indexY = indexTip.y *( height/ video.height);
         let thumbX =  thumbTip.x *(width/video.width);
        let thumbY = thumbTip.y *( height/ video.height);

    drawGlow(indexX, indexY);
     drawGlow(thumbX, thumbY);

    fill(255, 209,0, 180);
     circle(indexX, indexY,10);
    circle(thumbX, thumbY, 10);

    let pinchDistance = dist( indexX,indexY, thumbX, thumbY);
    if (pinchDistance <PINCH_DISTANCE) {
      let centerX = (indexX+thumbX) / 2;

         let centerY = (indexY+thumbY) / 2;

      let diameter = map( pinchDistance, 0, PINCH_DISTANCE, 50, 5);
      fill(255, 100, 0, 120);

      circle(centerX, centerY,diameter);
    }
  }
}

function drawGlow(x, y) {
  let baseRadius = 18 + sin( frameCount *  0.045) * 2;
  noStroke();
  for (let i = 20; i > 0; i--) {
    let alpha = map(i, 20,1, 0, 60);
     
        let r = baseRadius + i *1.8;

    fill(255, 209,0, alpha);

    ellipse(x, y, r,r);
  }
}

//for message project
function drawMessage() {
  messageAlpha = min( 255, messageAlpha+5);
  
     fill(0, messageAlpha *0.6);
  rect(0, 0, width, height);
  
     let boxScale = map(messageAlpha, 0, 255,0.8, 1);
  let boxWidth = width *0.7* boxScale;
   
  let boxHeight = height *0.5* boxScale;
  
  fill(255, messageAlpha);

  drawingContext.shadowBlur = 20* boxScale;

        drawingContext.shadowColor = color(255, 255, 255, messageAlpha *0.7);
  rect(width/2 - boxWidth/2, height/2 - 
    boxHeight/2, boxWidth, boxHeight);
  drawingContext.shadowBlur = 0;
  
  fill(0, messageAlpha);

  textSize(24* boxScale);
  textAlign(CENTER, CENTER); 

  text("In a world of instant gratification, we\ncommodify both nourishment and experience-\nthis project explores how what we consume\nstays with us, not in substance, but in memory,\nclutter, and trace.", 
       width/2, height/2);
}
//how long mouse pressed for
function mousePressed() {
      longPressStart = millis();
}

//iff mouse pressed long then clear the remnant bags and show message and reset everything
function mouseReleased() {
      if (millis() - longPressStart>=LONG_PRESS_DURATION) {
    collectedBags =[];

    showMessage = true;

    messageTimer = millis();
      messageAlpha =0;
  }
}

//dtetecting pinch
function gotHands(results) {
  hands =results;
  
  if ( hands.length >0) {
      let indexTip = hands[0].index_finger_tip;
      let thumbTip = hands[0].thumb_tip;
    
    let indexX = indexTip.x * (width / video.width);
      let indexY =indexTip.y * (height / video.height);
    let thumbX= thumbTip.x * (width /video.width);
    
    let thumbY =thumbTip.y * (height /video.height);
    
      let pinchDist = dist(indexX, indexY,thumbX, thumbY);
    
    // zoomed in bag becomes renmnats if pinch distance small
    if (zoomedBag )  {
      if (pinchDist <PINCH_CLOSE_DISTANCE) {
            if (!isPinchingToClose) {
          isPinchingToClose =true;

          pinchStartTime =millis();

          showDiscardMessage= true;
        }
            if (millis() -     
            pinchStartTime >  PINCH_HOLD_TIME&& millis() - lastPinchTime >PINCH_COOLDOWN) {
          zoomedBag = null;
              lastPinchTime = millis();

             isPinchingToClose =false;
            showDiscardMessage = false;
        }
      } else { //if pinch increased in distance then keep detecting
          isPinchingToClose = false;

        showDiscardMessage =false;
      }
    }
    
    // if no bag is zoomed in and small pinch distance then open new bag
if (!zoomedBag && millis() - lastPinchTime >PINCH_COOLDOWN &&pinchDist<PINCH_DISTANCE)     {

    let pinchCenterX = (indexX+thumbX) /2;

    let pinchCenterY = (indexY +thumbY) /2;
  
  for (let i = 0; i <compartments.length;i++)   {
    let compartment = compartments[i];

       if (compartment.isPointInside(pinchCenterX,pinchCenterY))  {
      let newBag = {};
        newBag.img = imgArray[compartment.index];
      newBag.x = random(width *0.1, width *0.9);
        newBag.y = random(height * 0.1, height *0.9);

      newBag.width = random(120, 180);

      newBag.height = random(150,210);
      newBag.rotation = random(-15, 15);

      newBag.scale =0;
      
          collectedBags.push(newBag); //new bag added to "collected bags" remanants
      
        zoomedBag = new ZoomedBag(
          imgArray[compartment.index],

        receiptArray[compartment.index]
      );
      
          lastPinchTime =millis();
         break;
    }
  }
}
} else { //no fingers 
    isPinchingToClose =false;

  showDiscardMessage = false;
  }
}

//constructor
function Compartment(x, y, index,w,h){
   this.x = x;
  this.y = y;

  this.index = index;

  this.regionWidth = w;
      this.regionHeight = h;
  
  //checks if x-y coordinates are wihtin compartment region
  this.isPointInside = function(x, y){
    return x > this.x - this.regionWidth/2 &&
                x < this.x + this.regionWidth/2 &&

             y > this.y - this.regionHeight/2 &&
             
             y < this.y + this.regionHeight/2;
    };
  
  //red rectangel comparemnt marker
  this.display = function() {
    noFill();

    stroke(255, 0,0, 150);

      strokeWeight(2);
    rect(this.x - this.regionWidth/2, this.y - this.regionHeight/2, 
         this.regionWidth, this.regionHeight);
  };
  }

//constructor (to zoom in the bag)
function ZoomedBag(bagImg, receiptImg){

  this.bagImg = bagImg;

  this.receiptImg = receiptImg;
      this.startTime = millis();
   this.animationProgress = 0;
  this.targetWidth = min(width, height) *0.6;

  this.targetHeight = this.targetWidth *1.1;
  
  //animation effect
  this.display = function() {
      this.animationProgress = min(1, (millis() - this.startTime) / 400);
    
    // overlay to mute background
    fill(0, map(this.animationProgress, 0, 1,0,180));

      noStroke();
    rect(0, 0, width, height);
    
    // "elastic" animation & scale
    let elasticProgress = elasticOut(this.animationProgress);
         let currentWidth = this.targetWidth *elasticProgress;
      
         let currentHeight = this.targetHeight * elasticProgress;
    
    //  bag
    let bagX = width/2 - currentWidth/2;
      let bagY = height/2 - currentHeight/2;

     image(this.bagImg, bagX, bagY, currentWidth, currentHeight);
    
    //receipt 
    let receiptProgress = min(1, (millis() - this.startTime - 150) /400);
      let receiptEased = easeInOutQuad(receiptProgress);

    let receiptWidth = this.targetWidth*0.5* receiptEased; 

     let receiptHeight = receiptWidth *3.1;

    image(this.receiptImg, width/2 + currentWidth/2 +30, 
          height/2 - receiptHeight/2, receiptWidth, receiptHeight);
  };
  }
 //ease in out effect
function easeInOutQuad(t) {
       if (t < 0.5) return 2* t *t;
  return -1 + (4 -2*t) *t;
}

//make bag spring when zoomed in
function elasticOut(t) {

  let p =0.3;
    return Math.pow(2, -10* t) * Math.sin((t- p/4) * (2*Math.PI) / p) + 1;
      }

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);
    video.size(width, height);
  }

//when mouse no longer pressed then clear the rmemnants bag array and open/close cabinet
function mouseReleased() {

  if (millis() - longPressStart >= LONG_PRESS_DURATION) {

    cabinetIsOpen = true;
      cabinetOpeningTime = millis();
    
     setTimeout (function() {
        collectedBags= [];
      
        showMessage = true;
       messageTimer =millis();
       messageAlpha = 0;
      
      setTimeout(function() {
          cabinetIsOpen = false;
        },1000);
      
      }, CABINET_OPEN_DURATION);
      }
      }
//notifs
  function startNotificationCycle() {

  currentNotifStage =0;
    notifTimer = millis();
  notifY = -200; 

      currentGuyImage = null;

    currentTextNotif = null;
}

  function updateNotifications() {
  //how long for each notif
      
  let stageDuration = [3000,4000,3000, 3000, 3000]; 
    
  //check to move on to next notif
   if (millis() - notifTimer > stageDuration[currentNotifStage]) {

    currentNotifStage++;
      notifTimer = millis();
    
    // after 7-10 seconds star tagain
      if (currentNotifStage >= stageDuration.length) {

      setTimeout(startNotificationCycle, random(7000, 10000));

      return;
    }
    }
  
   if (currentNotifStage == 0) { // sent message notif slides down
    notifY = min(50, notifY +3);
       } 
   else if (currentNotifStage == 1) { // serious guy face
      notifY = max(-200, notifY -3); 

    currentGuyImage = guyImages[0];
  }
          else if (currentNotifStage == 2) { // which box numbers

    currentTextNotif = textNotifs[0]; 
           }
              else if (currentNotifStage == 3) { // pinch notif
    currentTextNotif = textNotifs[1]; 
      }
         else if (currentNotifStage == 4) { // happy guy face
        currentTextNotif = textNotifs[2];  //how to clear clutter

          currentGuyImage = guyImages[1]; 
  }
}

function drawNotifications() {
    if (currentNotifStage ==0) {

          image(notifImg, width/2-200, notifY-90, 400, 160); 
      }
  
      if (currentGuyImage) {
          image(currentGuyImage,width/2 -17, height/2-55 -110,90, 98) ;
  }
  
      if (currentTextNotif) {
        
        image(currentTextNotif, width/2 -400, 130,350,120);
  }
}   