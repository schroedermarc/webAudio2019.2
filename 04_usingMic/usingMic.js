var bandSize;

const synth = new Tone.Synth({ volume: -20 });
var meter = new Tone.Meter();
var mic = new Tone.UserMedia()

const samplerVolume = 0;

const audio = document.querySelector('audio');

const actx = Tone.context;
const dest = actx.createMediaStreamDestination();
const recorder = new MediaRecorder(dest.stream);
var chunks = [];
var startRecordButton, endRecordButton, playSampleButton, octSelect;
var octave = 3;
var isRecording = false;

mic.connect(dest);

//connect mic to the meter
mic.connect(meter);

// start the mic
mic.open();

// for some reason we need to have a synth going (but not connected to master for the input to work)
// ... don't ask me why.
setInterval(() => {
  synth.triggerAttackRelease('E2');
  var level = meter.getLevel();
  // console.log(level)
}, 1000)



function setup() {
  var c = createCanvas(800, 500);
  c.parent('canvas-container');

  sampler = new Tone.Sampler()
  sampler.toMaster();

  startRecordButton = createButton('Start Recording')
    .position(20, 60)
    .mousePressed(() => {
      sampler.volume = -80;
      recorder.start();
      console.log('started')
      isRecording = true;
    })
    .mouseReleased(() => {
      sampler.volume = samplerVolume;
      recorder.stop();
      isRecording = false;
    })



}

function draw() {
  background('black');

  bandSize = width / 7;
  stroke('white');
  for (var i = 0; i < bandSize; i++) {
    var x = i * bandSize;
    line(x, 0, x, height);
  }

  isRecording ? fill('red') : fill('white');
  noStroke();
  ellipse(width / 2, height / 2, map(meter.getLevel(), -60, 0, 0, 100))
}


recorder.ondataavailable = function (e) {
  chunks.push(e.data);
}
recorder.onstop = function (e) {
  let blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
  var theURL = URL.createObjectURL(blob);
  sampler.add('C3', theURL);

  chunks = [];
};

function mousePressed() {

  // don't trigger if pressing button
  if (mouseY > 50) {
    // calculate which key was clicked
    var bandSize = width / 7;
    var key = Math.floor(mouseX / bandSize);

    // get note value
    const scale = getScaleRange("C", "major", octave);
    const note = scale[key];

    // trigger attack
    sampler.triggerAttack(note)
  }

}

function mouseReleased() {
  sampler.triggerRelease();
}

document.getElementById('plus-button').addEventListener('click', () => {
  if (octave < 7) {
    octave++;
    document.getElementById('octave-num').innerHTML = octave;
  }
})

document.getElementById('minus-button').addEventListener('click', () => {
  if (octave > 1) {
    octave--;
  }
  document.getElementById('octave-num').innerHTML = octave;
})