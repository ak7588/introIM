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
  
  // get info from processing  
  if(Serial.available()>0){
    char state = Serial.read();
    
    if (state == 'S'){ // if turned on
      tone(speakerPin, notes[0], 200); // play start sound
      digitalWrite(greenPin, HIGH);
    }
    
    else if (state == 'P'){
      digitalWrite(greenPin, LOW);
      delay(1000);
      playPassword();
    }

    else if (state == 'I'){
      takeInput();
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
    RGB_color(238,201,170);
    tone(speakerPin, notes[1], 500);
    delay(1500);
    // play the second key
    RGB_color(10,255,0);
    tone(speakerPin, notes[2], 500);
    delay(1500);
    // play the third key
    RGB_color(10, 216, 230);
    tone(speakerPin, notes[3], 500);
    delay(1500);
    // stop and send data to processing
    RGB_color(0, 0, 0);
    passwordState = false;
    Serial.write(1);
  }
}

void takeInput(){  
  // button states
  int gState = digitalRead(greenButton);
  int bState = digitalRead(blueButton);
  int enterState = digitalRead(enterButton);
  int rState = digitalRead(redButton);

  if (rState){
    tone(speakerPin, notes[5], 200);
    RGB_color(100,101,170);
  }

  if (gState){
    tone(speakerPin, notes[1], 200);
    RGB_color(238,201,170);
  }

  if (bState){
    tone(speakerPin, notes[2], 200);
    RGB_color(10,255,0);
  }
}


/*


  PROCESSING CODE


import processing.serial.*;
Serial myPort;
int fromArduino;
ArrayList<Integer> password = new ArrayList<Integer>();

void setup(){
  size(960,720);
  printArray(Serial.list());
  String portname=Serial.list()[1];
  println(portname);
  myPort = new Serial(this,portname,9600);
}

void draw(){
  background(255);
  if (mousePressed==true) { 
    myPort.write('S');
    delay(1000);
    myPort.write('P');
  }
  if (fromArduino == 1){
    myPort.write('I');
    password.add(fromArduino);
  }
}

void serialEvent(Serial myPort){
  fromArduino = myPort.read();    
}

*/
