// scene globals
var startButton, stopButton;

///////////////////////////////
// instrument options
///////////////////////////////

//////////////////////////
// effect options
//////////////////////////


//////////////////////////////
// instruments
/////////////////////////////


/////////////////////////////
// effects
/////////////////////////////


///////////////////////////////
// routing
//////////////////////////////





function setup() {

  createCanvas(400, 400);

  startButton = createButton('start');
  stopButton = createButton('stop');
  startButton.position(10, 10);
  stopButton.position(10, 30);
  startButton.mousePressed(startSong);
  stopButton.mousePressed(stopSong);

  // START SEQUENCES HERE


  Tone.Transport.start();



}


function draw() {

  background(0);

}


function startSong() {
  Tone.Transport.start();
}

function stopSong() {
  Tone.Transport.stop();

}