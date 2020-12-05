#include "pitches.h"

// buttons 
int enterButton = 8;
int redButton = 7;
int greenButton = 4;
int blueButton = 2;

int speakerPin = 12; // speaker
int notes[11] = {NOTE_C4, NOTE_D4, NOTE_E4, NOTE_DS2, NOTE_E2, NOTE_F2, NOTE_FS2, NOTE_G2, NOTE_GS2, NOTE_A2, NOTE_AS2};

// RGB LED
int bluePin= 11;
int redPin = 9;
int greenPin = 10;

bool passwordState = true;
bool isRight = false;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  pinMode(enterButton, INPUT);
  pinMode(redButton, INPUT);
  pinMode(greenButton, INPUT);
  pinMode(blueButton, INPUT);
}

void loop() {

  // button states
  int gState = digitalRead(greenButton);
  int bState = digitalRead(blueButton);
  int enterState = digitalRead(enterButton);
  int rState = digitalRead(redButton);

  if (rState){
    tone(speakerPin, notes[5], 200);
    RGB_color(226,59,255);
    delay(500);
    RGB_color(0, 0, 0);
    Serial.write(2);
  }

  if (gState){
    tone(speakerPin, notes[1], 200);
    RGB_color(255,193,59);
    delay(500);
    RGB_color(0, 0, 0);
    Serial.write(3);
  }

  if (bState){
    tone(speakerPin, notes[2], 200);
    RGB_color(59,118,255);
    delay(500);
    RGB_color(0, 0, 0);
    Serial.write(4);
  }

  if (enterState){
    tone(speakerPin, notes[1], 100);
    delay(120);
    Serial.write(5);
  }
  
  // get info from processing  
  if(Serial.available()>0){
    
    char state = Serial.read();
    
    if (state == 'S'){ // if turned on
      tone(speakerPin, notes[0], 200); // play start sound
      digitalWrite(greenPin, HIGH);
      delay(700);
    }
    
    else if (state == 'P'){
      digitalWrite(greenPin, LOW);
      delay(500); // blink without delay
      passwordState = true;
      playPassword();
    }

    else if (state == 'Z'){
      enterZoomTrue();
    }

    else if (state == 'N'){
      enterZoomFalse();
    }
  }
}

// light up the bulb
void RGB_color(int red, int green, int blue){
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);
}

void playPassword(){
  if (passwordState == true){
    // play the first key
    RGB_color(0, 0, 0);
    RGB_color(59,118,255);
    tone(speakerPin, notes[1], 500);
    delay(1500);
    // play the second key
    RGB_color(0, 0, 0);
    RGB_color(226,59,255);
    tone(speakerPin, notes[2], 500);
    delay(1500);
    // play the third key
    RGB_color(0, 0, 0);
    RGB_color(255,193,59);
    tone(speakerPin, notes[3], 500);
    delay(1500);
    // stop and send data to processing
    RGB_color(0, 0, 0);
    Serial.write(6);
    passwordState = false;
  }
}

void enterZoomTrue(){
  isRight = true;
  for(int note = 3; note < 7; note++){
    tone(speakerPin, notes[note], 300);
  }
    digitalWrite(greenPin, HIGH);
    delay(500);
    digitalWrite(greenPin, LOW);
    Serial.write(1);
}

void enterZoomFalse(){
  if (isRight == false){
    for(int note = 0; note < 2; note++){
    tone(speakerPin, notes[note], 200);
  }
    digitalWrite(redPin, HIGH);
    delay(500);
    digitalWrite(redPin, LOW);
  }
}


/*

  PROCESSING CODE

import processing.serial.*;
Serial myPort;
int fromArduino;
ArrayList<Integer> password = new ArrayList<Integer>();
int[] rightPassword;

void setup(){
  size(960,720);
  printArray(Serial.list());
  String portname=Serial.list()[1];
  println(portname);
  myPort = new Serial(this,portname,9600);
  rightPassword = new int []{4, 2, 3};
}

void draw(){
  background(255);
  if (mousePressed==true) { 
    myPort.write('S');
    delay(1000);
    myPort.write('P');
  }
}

void serialEvent(Serial myPort){
    fromArduino = myPort.read();
    
    if (fromArduino == 1){
      int changeScene = 1;
    }
  
    if (fromArduino == 2){
      password.add(fromArduino);
    }
  
    else if (fromArduino == 3){
      password.add(fromArduino);
    }
  
    else if (fromArduino == 4){
      password.add(fromArduino);
    }
  
    else if (fromArduino == 5){
      if(passwordCheck()){
       myPort.write('Z'); // switch the scene
      }
      else{
        myPort.write('N'); // repeat the input
      }
    password.clear();
    }
}
  

// check password functions
boolean passwordCheck(){
  if (password.size()==rightPassword.length){
    printArray(password);
    for (int element = 0; element < password.size(); element++){
      if (password.get(element) != rightPassword[element]){
         return false;
      }
    }
  }
  else {
    return false;
  }
  return true;
}

*/
