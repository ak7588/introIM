// 0: LoginScreen
// 1: ObserveScreen
// 2: RepeatScreen
// 3: MeetingScreen
// 4: CongratsScreen

var gameScreen = 0;
let zoomLogo; //image of Zoom logo
let pushButton; //image of pushing Button
var userVideo;
let startT, deltaT = 30000; //for timer on gameScreen 3
let congrImg1, congrImg2, congrImg3; //3 congrats images

// added by Amina ----------------------------

let serial; // store instance of the serial port
let fromArduino; // read from the serial port    
let myPort = '/dev/tty.usbmodem14201';
let password = [];
let rightPassword = [4, 2, 3];
let options = { baudrate: 9600}; 

// -------------------------------------------

function preload() {
  //preload images and videos here
  zoomLogo = loadImage('assets/zoomRed.png');
  clickButton = loadImage('assets/clickButton.png');

  susVid = createVideo(['assets/susanne.mp4', 'assets/susanne.ogv', 'assets/susanne.webm'], vidLoadS);
  susVid.size(300, 200);
  susVid.hide();
  
  amiVid = createVideo(['assets/amina.mp4', 'assets/amina.ogv', 'assets/amina.webm'], vidLoadL);
  amiVid.size(300, 200);
  amiVid.hide();
  
  //emoji for congratsScreen
  congrImg1 = loadImage('assets/congrats1.png');
  congrImg2 = loadImage('assets/congrats2.png');
  congrImg3 = loadImage('assets/congrats3.png');
}

function setup() {
  startT=millis(); //neded for timer for gameScreen 3
  
  // added by Amina ----------------------------
  
  serial = new p5.SerialPort();
  serial.open(myPort, options);
  serial.on('data', serialEvent);     // callback for when new data arrives
  
  // -------------------------------------------
  
  createCanvas(900, 600);
  //Design setup
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  //textFont(?);
  textSize(18);
  //video setup
  userVideo = createCapture(VIDEO);
  userVideo.size(300, 200);
  userVideo.hide();
  //userVideo.scale(-1,1);
  //display prerecorded videos
  //testVideo = createVideo(['assets/testVideo.mp4', 'assets/testVideo.ogv', 'assets/testVideo.webm'], vidLoad);
  //testVideo.size(300, 200);
  //testVideo.hide();
}

// added by Amina ----------------------------

function serialEvent(){
  
  fromArduino = Number(serial.read());
  print("Received: " + fromArduino)
  
  if (fromArduino == 54){
      gameScreen = 2;
  }
    
  else if (fromArduino == 1){
      gameScreen = 3;
  }
  
  else if (fromArduino == 2){
    password.push(fromArduino);
  }

  else if (fromArduino == 3){
    password.push(fromArduino);
  }

  else if (fromArduino == 4){
    password.push(fromArduino);
  }

  else if (fromArduino == 5){

    if(passwordCheck()){
     serial.write('Z'); // switch the scene
    }

    else{
      serial.write('N'); // repeat the input
    }

    while(password.length > 0) { // clear the array
      password.pop();
    } 
  }
  
}

// functions that checks input password
function passwordCheck(){
  
  if (password[0] == 4 && password[1] == 2 && password[2] == 3) return true;
  else return false;
}

// -------------------------------------------


function draw() {

  if (gameScreen == 0) {
    LoginScreen()
  } else if (gameScreen == 1) {
    ObserveScreen()
  } else if (gameScreen == 2) {
    RepeatScreen()
  } else if (gameScreen == 3) {
    MeetingScreen()
  } else if (gameScreen == 4) {
    CongratsScreen()
  }
}

function LoginScreen() {
  //mute video as it plays it currently loops in the background
  susVid.volume(0);
  amiVid.volume(0);
  
  //code for LoginScreen
  background(255); //screen color
  //smaller rect for log in window
  noStroke();
  fill(250, 216, 218);
  rect(width / 2, height / 2, width / 1.5, height / 1.4, 10);

  image(zoomLogo, width / 2, height / 4, 123, 50);
  let introText = 'Welcome to our waiting room. In order to join our meeting you will have to repeat a pattern that we present to you in sound and tone. Ready?';
  fill(209, 47, 40);
  text(introText, width / 2, height / 2, width / 3, height / 5);
  //"click to join" button
  //button = createButton('Click to join.');
  //button.position(width / 2, height / 2);
  //button.mousePressed(gameScreen = 1); //how to get this to work?
  fill(255);
  rect(width / 2, 2 * height / 3, 125, 25, 5);
  fill(209, 47, 40);
  text('Join meeting', width / 2, 2 * height / 3);

  //hover over button effect
  if (mouseX > 387 && mouseX < 513 && mouseY > 387 && mouseY < 413) {
    fill(209, 47, 40);
    rect(width / 2, 2 * height / 3, 125, 25, 5);
    fill(255);
    text('Join meeting', width / 2, 2 * height / 3);
  }

  print(mouseX, mouseY);

  //display next screen when button is pressed
  if (mouseIsPressed == true && mouseX > 387 && mouseX < 513 && mouseY > 387 && mouseY < 413) {
    
    gameScreen = 1;
    
    // added by Amina ---------
    
    serial.write('S');
    serial.write('P');
    
    // ------------------------
    
  }
}

function ObserveScreen() {
  //code for ObserveScreen
  background(255); //screen color
  //smaller rect for message window
  noStroke();
  fill(250, 216, 218);
  rect(width / 2, height / 2, width / 1.5, height / 1.4, 10);

  image(zoomLogo, width / 2, height / 4, 123, 50);

  fill(209, 47, 40); //text fill red
  push();
  textStyle(BOLD);
  text('Please wait and observe the LEDs', width / 2, 230);
  pop();

  let introText = 'The meeting hosts want to test your memory. You can enter the meeting after you repeat the pattern';
  text(introText, width / 2, height / 2, width / 3, height / 5);

  fill(255);
  ellipse(width / 2 - 50, 2 * height / 3, 20, 20);
  ellipse(width / 2, 2 * height / 3, 20, 20);
  ellipse(width / 2 + 50, 2 * height / 3, 20, 20);

  //add communication with Arduino here to display next screen after pattern has been presented
  //if (mouseIsPressed == true){
  //  gameScreen = 1;
  //}
}

function RepeatScreen() {
  //code for RepeatScreen
  background(255); //screen color
  //smaller rect for message window
  noStroke();
  fill(250, 216, 218);
  rect(width / 2, height / 2, width / 1.5, height / 1.4, 10);

  image(zoomLogo, width / 2, height / 4, 123, 50);

  fill(209, 47, 40); //text fill red
  text('Ready?', width / 2, 230);

  push();
  textStyle(BOLD);
  let introText = 'Please repeat the password pattern using the buttons';
  text(introText, width / 2, height / 2, width / 3, height / 5);
  pop();

  fill(255);

  image(clickButton, width / 2 - 50, 2 * height / 3, 40, 60);
  image(clickButton, width / 2, 2 * height / 3, 40, 60);
  image(clickButton, width / 2 + 50, 2 * height / 3, 40, 60);
}

function MeetingScreen() {
  //add code for screen here
  myTimer(); //display new screen after 30 sec/length of video
  
  background(250, 216, 218);
 
  //live video input of user/player
  image(userVideo, width+40, height + 110);
  
  //prerecorded video of Susanne
  image(susVid, width+135, height-165); //display prerecorded video, currently looping
  susVid.size(300, 200);
  susVid.volume(1); 
  
  //prerecorded video of Amina
  image(amiVid, width-200, height-165); //display prerecorded video, currently looping
  amiVid.size(300, 200);
  amiVid.volume(1);

  //Zoom names
  fill(255);
  text('Amina', 155, 270);
  text('Susanne', 515, 270);
  text('YOU', 322, 510);

  //exit button
  noStroke();
  push();
  rectMode(CORNER);
  fill(255);
  rect(width - 165, height - 55, 150, 40, 5);
  fill(209, 47, 40);
  text('Leave meeting', width - 165, height - 55, 150, 40);
  pop();

  //hover over exit button effect
  if (mouseX > width - 85 && mouseX < width - 15 && mouseY > height - 55 && mouseY < height - 15) {
    push();
    rectMode(CORNER);
    fill(209, 47, 40);
    rect(width - 165, height - 55, 150, 40, 5);
    fill(255);
    text('Leave meeting', width - 165, height - 55, 150, 40);
    pop();
  }
  
  //display first screen again when button is pressed
  if (mouseIsPressed == mouseX > width - 85 && mouseX < width - 15 && mouseY > height - 55 && mouseY < height - 15) {
    gameScreen = 4;
  }
}

function vidLoadS() {
  susVid.play();
  susVid.volume(0);
  susVid.position(width/2, height/2);
}

function vidLoadL() {
  amiVid.play();
  amiVid.volume(0);
  amiVid.position(width/2, height/2);
}

//timer function for gameScreen 3
function myTimer() {
  if (millis() > startT + deltaT) {
    startT = millis()
    console.log("video is over, time to move on"); // do what you have to do!
    gameScreen=4;
  }
}

function CongratsScreen() {
  background(250, 216, 218);
  push();
  fill(209, 47, 40);
  text('Congrats You made it!', width / 2, height / 2);
  pop();
  
  //display emoji
  image(congrImg1, width / 2, height / 4, 100, 100);
  image(congrImg2, width / 5, 3.2*height / 4, 150, 150);
  image(congrImg3, 4*width / 5, 3.2*height / 4, 150, 150);
  
  //play again button
  noStroke();
  rectMode(CENTER);
  fill(255);
  rect(width/2, height/2+50, 150, 40, 5);
  fill(209, 47, 40);
  text('Play again', width/2, height/2+50, 150, 40);
  
  //hover over "Play again" button effect
  if (mouseX > width/2 - 75 && mouseX < width/2 + 75 && mouseY > height/2+30 && mouseY < height/2+70) {
    rectMode(CENTER);
    fill(209, 47, 40);
    rect(width/2, height/2+50, 150, 40, 5);
    fill(255);
    text('Play again', width/2, height/2+50, 150, 40);
  }
  
  //display first screen again when button is pressed
  if (mouseIsPressed == mouseX > width/2 - 75 && mouseX < width/2 + 75 && mouseY > height/2+30 && mouseY < height/2+70) {
    gameScreen = 0;
  }
}