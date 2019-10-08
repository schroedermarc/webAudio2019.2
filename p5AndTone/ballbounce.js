
let ball, vel;
let synth, synth2;
let chordPlayed = false;

let scale = ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'];
// let octaves = [1, 2, 3, 4, 5];

let synthSettings = {
  frequency: "C4",
  detune: 0,
  oscillator: {
    type: "sawtooth"
  },
  filter: {
    Q: 6,
    type: "lowpass",
    rolloff: -24
  },
  envelope: {
    attack: 0.005,
    decay: 0.1,
    sustain: 0.9,
    release: 1
  },
  filterEnvelope: {
    attack: 0.2,
    decay: 0.05,
    sustain: 0.2,
    release: 2,
    baseFrequency: 300,
    octaves: 7,
    exponent: 2
  }
};

let synth2Settings = {
  frequency: "C4",
  detune: 0,
  oscillator: {
    type: "sawtooth"
  },
  filter: {
    Q: 6,
    type: "lowpass",
    rolloff: -24
  },
  envelope: {
    attack: 4,
    decay: 0.1,
    sustain: 0.9,
    release: 1
  },
  filterEnvelope: {
    attack: 0.02,
    decay: 0.05,
    sustain: 0.2,
    release: 2,
    baseFrequency: 300,
    octaves: 7,
    exponent: 2
  }
};

function setup() {
  createCanvas(800, 800);

  ball = createVector(width - 50, height / 2);
  vel = createVector(random(10, 5), random(1, 4));

  synth = new Tone.MonoSynth(synthSettings).toMaster();
  synth2 = new Tone.PolySynth(synth2Settings).toMaster();

}

function draw() {
  background("black");


  ellipse(width / 2, height / 2, 200, 200);

  // check if on edges
  if (ball.x <= 10 || ball.x >= width - 10) {
    // reverse direction
    vel.x *= -1;
    const notes = [...getScaleRange('Eb', 'major', 2)]
    synth.triggerAttackRelease(random(notes), "16n");
  }

  if (ball.y <= 10 || ball.y >= height - 10) {
    // reverse direction
    vel.y *= -1;

    const notes = [...getScaleRange('Eb', 'major', 2)]
    synth.triggerAttackRelease(random(notes), "16n");
  }

  const distCenterX = Math.abs(ball.x - width / 2);
  const distCenterY = Math.abs(ball.y - height / 2);

  if (Math.sqrt(Math.pow(distCenterX, 2) + Math.pow(distCenterY, 2)) < 100) {
    fill(random(255), random(255), random(255));
    if (!chordPlayed) {
      synth2.triggerAttackRelease(getChord('Eb', 'major', 3), '2n');
      chordPlayed = true;
    }
  } else {
    chordPlayed = false;
    fill('white')
  }

  ball.add(vel);


  //render ball

  ellipse(ball.x, ball.y, 20);

}