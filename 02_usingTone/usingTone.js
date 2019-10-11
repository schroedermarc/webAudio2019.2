//////////////////////
// controls
/////////////////////
let drawWave = true;
let effectOn = true;
let octave = 3;

let synth, delay, autoFilter;
let wave;
let select;
let isFFT = false;

const synthSettings = {
  volume: -15,
  frequency: "C7",
  detune: 0,
  oscillator: {
    type: "sawtooth" //sine, sawtooth, triangle
  },
  filter: {
    Q: 1,
    type: "lowpass",
    rolloff: -48
  },
  envelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.9,
    release: 4
  },
  filterEnvelope: {
    attack: 3,
    decay: 1,
    sustain: 0.5,
    release: 1,
    baseFrequency: 300,
    octaves: 7,
    exponent: 5
  }
}

const delaySettings = {
  delayTime: 0.25,
  maxDelay: 1,
  wet: 0.5,
  feedback: 0.7
}

function setup() {
  var c = createCanvas(900, 600);
  c.parent('canvas-container');

  if (drawWave) {
    select = createSelect()
    select.position(10, 50);
    select.option('Waveform');
    select.option('FFT');
    select.changed(() => {
      if (select.value() === "FFT") {
        isFFT = true;
      } else {
        isFFT = false;
      }
    })
  }

  // create tone elements
  synth = new Tone.MonoSynth(synthSettings);
  delay = new Tone.FeedbackDelay(delaySettings);
  autoFilter = new Tone.Chorus({

  });
  fft = new Tone.FFT(256).toMaster();
  wave = new Tone.Waveform(256).toMaster();

  console.log()

  // routing
  if (effectOn) {
    synth.connect(autoFilter);
    autoFilter.connect(fft);
    fft.connect(wave);
  } else {
    synth.connect(fft);
    synth.connect(wave);
  }



}

function draw() {
  background("black");


  // draw keyboard
  for (var i = 0; i < 7; i++) {
    var x = i * (width / 7);

    stroke('white');
    strokeWeight(2);
    line(x, 0, x, height);
  }


  // get wave array
  if (drawWave) {
    noFill();
    strokeWeight(3);
    stroke('red');
    if (isFFT) {
      const waveArray = fft.getValue();
      beginShape();
      for (let i = 0; i < waveArray.length; i++) {
        curveVertex(map(log(i), 0, log(waveArray.length), 0, width), map(waveArray[i], -200, 0, height, 0));
      }
      endShape();
    } else {
      // get wave array
      const waveArray = wave.getValue();
      const bandSize = width / 256.0;
      beginShape();
      for (let i = 0; i < waveArray.length; i++) {
        curveVertex(bandSize * i, map(waveArray[i], -1, 1, height, 0));
      }
      endShape();
    }
  }

}


function mousePressed() {

  if (mouseY > 30) {
    // calculate which key was clicked
    var bandSize = width / 7;
    var key = Math.floor(mouseX / bandSize);

    // get note value
    const scale = getScaleRange("C", "major", octave);
    const note = scale[key];

    // trigger attack
    synth.triggerAttack(note)
  }

  mouseStartY = mouseY;

}

function mouseReleased() {

  // trigger release
  synth.triggerRelease();

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
    document.getElementById('octave-num').innerHTML = octave;
  }

})