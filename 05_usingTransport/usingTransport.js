// scene globals
var starButton, stopButton;

///////////////////////////////
// instrument options
///////////////////////////////
const kickSynthOptions = {
  volume: 0,
  pitchDecay: 0.45,
  octaves: 7,
  oscillator: {
    type: "sine"
  },
  envelope: {
    attack: 0.002,
    decay: 0.8,
    sustain: 0.2,
    release: 1.4,
    attackCurve: "exponential"
  }
}

const synthOptions = {
  attackNoise: 1,
  dampening: 6000,
  resonance: 0.7,
  volume: 0
};

const synth2Options = {
  vibratoAmount: 0.5,
  vibratoRate: 10,
  harmonicity: 0.2,
  voice0: {
    volume: -30,
    portamento: 0,
    oscillator: {
      type: "sine"
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0,
      sustain: 1,
      release: 0.1
    },
    envelope: {
      attack: 0.01,
      decay: 0,
      sustain: 1,
      release: 0.5
    }
  },
  voice1: {
    volume: -10,
    portamento: 0,
    oscillator: {
      type: "sine"
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0,
      sustain: 1,
      release: 0.5
    },
    envelope: {
      attack: 0.01,
      decay: 0,
      sustain: 1,
      release: 0.5
    }
  }
}

const snareOptions = {
  volume: -5,
  pitchDecay: 0.05,
  octaves: 6,
  oscillator: {
    type: "sine"
  },
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0.01,
    release: 0.3,
    attackCurve: "exponential"
  }
}


//////////////////////////
// effect options
//////////////////////////

const filterOptions = {
  frequency: "4t",
  type: "sine",
  depth: 0.8,
  baseFrequency: 400,
  octaves: 3,
  filter: {
    type: "lowpass",
    rolloff: -24,
    Q: 1.12
  }
}

const hatPingPongOptions = {
  "delayTime": '16n',
  "feedback": 0.6,
  'wet': 0.9
}

const snarePingPongOptions = {
  "delayTime": '16n',
  "feedback": 0.2,
  'wet': 0.3
}

//////////////////////////////
// instruments
/////////////////////////////
const synth = new Tone.PluckSynth(synthOptions);
const synth2 = new Tone.DuoSynth(synth2Options);
var synth3 = new Tone.PolySynth(6, Tone.Synth, {
  oscillator: {
    type: "square"
  }
}).toMaster();
const drumSynth = new Tone.MembraneSynth(kickSynthOptions);
const sampler = new Tone.Sampler({
  "C3": '../samples/closedHat.wav'
}, {
  "volume": -10,
  "attack": 0.0,
  "release": 0.2
});
// const snareSynth = new Tone.MembraneSynth(snareOptions);
const snareSynth = new Tone.MembraneSynth(snareOptions);

/////////////////////////////
// effects
/////////////////////////////
const autoFilter = new Tone.AutoFilter(filterOptions);
const delay = new Tone.FeedbackDelay('8n', '0.1');
const reverb = new Tone.Freeverb({
  roomSize: 0.5,
  dampening: 1000
});
const pingPong = new Tone.PingPongDelay(hatPingPongOptions);
const snarePingPong = new Tone.PingPongDelay(snarePingPongOptions);


///////////////////////////////
// routing
//////////////////////////////
synth2.connect(delay);
delay.toMaster();


synth.connect(autoFilter);
autoFilter.toMaster().start();


drumSynth.toMaster();

sampler.connect(pingPong);
pingPong.toMaster();

snareSynth.connect(snarePingPong);
snarePingPong.toMaster();


// note patterns
const notes = [["Bb1", "Bb1"]];
const kicks = ['C0'];
const cymNotes = ['A4', ['A4', 'E3']];
const snareNotes = [null, 'Bb4', null, 'Bb4', null, 'Bb4', null, 'Bb4', null, 'Bb4', null, 'Bb4', null, 'Bb4', null, [['Eb5', 'Eb5'], 'Bb4']];

/////////////////////////////
//sequences
////////////////////////////
const synthPart = new Tone.Sequence(function (time, note) {
  synth.triggerAttackRelease(note, '10hz', time, 1);
}, notes, "8n")

const kicksPart = new Tone.Sequence(function (time, note) {
  drumSynth.triggerAttackRelease(note, '8n', time, 0.5);
}, kicks, "4n")

const cymPart = new Tone.Sequence(function (time, note) {
  sampler.triggerAttackRelease(note, '32n', time, 1);
}, cymNotes, "4n");

const snarePart = new Tone.Sequence(function (time, note) {
  snareSynth.triggerAttackRelease(note, '16n', time, 1);

}, snareNotes, '4n')




function setup() {

  createCanvas(400, 400);

  startButton = createButton('start');
  stopButton = createButton('stop');
  startButton.position(10, 10);
  stopButton.position(10, 30);
  startButton.mousePressed(startSong);
  stopButton.mousePressed(stopSong);

  synthPart.start(0);
  kicksPart.start(0);
  cymPart.start(0);
  snarePart.start(0)


  Tone.Transport.start("+0.1");



}


function draw() {

  background(0);
  // autoFilter.baseFrequency = map(mouseX, 0, width, 300, 4000);

  fill('white');
  var x = map(drumSynth.envelope.value, 0, 1, 0, 200);
  ellipse(200, 200, x);

}


function startSong() {
  Tone.Transport.start("+0.1");
}

function stopSong() {
  Tone.Transport.stop();

}