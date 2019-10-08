// scene globals
var starButton, stopButton;

// instrument options
const synthOptions = {
  attackNoise: 1,
  dampening: 6000,
  resonance: 0.7
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

const wahOptions = {
  baseFrequency: 1300,
  octaves: 8,
  sensitivity: 3,
  Q: 2,
  gain: 1,
  follower: {
    attack: 0.1,
    release: 0.5
  }
}

//instruments
const synth = new Tone.PluckSynth(synthOptions);
const synth2 = new Tone.DuoSynth(synth2Options);
var synth3 = new Tone.PolySynth(6, Tone.Synth, {
  oscillator: {
    type: "square"
  }
}).toMaster();
const drumSynth = new Tone.MembraneSynth();
const cymSynth = new Tone.MetalSynth();


//effects
const autoWah = new Tone.AutoWah(wahOptions);
const delay = new Tone.FeedbackDelay('8n', '0.1');
const reverb = new Tone.Reverb(1);
const gain = new Tone.Gain()

// routing

//synth2 -> delay -> master
synth2.chain(gain, delay, Tone.Master);


//synth -> gain -> reverb -> master
synth.connect(autoWah);
reverb.toMaster();
autoWah.toMaster();

// kick -> master
drumSynth.toMaster();



cymSynth.toMaster();

// note patterns
const notes = [["Bb1", "Bb1"]];
const notes2 = getScaleRange('Bb', 'minor', 3);
const kicks = ['C1'];


//sequences
const synthPart = new Tone.Sequence(function (time, note) {
  synth.triggerAttackRelease(note, '10hz', time, 1);

  Tone.Draw.schedule(function () {
    fill('red');
    ellipse(random(0, width), random(0, height), map(autoWah.baseFrequency, 300, 4000, 0, 70));
  })
}, notes, "8n")


const synthPartHigh = new Tone.Sequence(function (time, note) {
  synth2.triggerAttackRelease(note, '16n', time, 0.5);
}, notes2, "16n")




const kicksPart = new Tone.Sequence(function (time, note) {
  drumSynth.triggerAttackRelease(note, '16n', time, 0.5);

  Tone.Draw.schedule(function () {
    fill('white');
  })
}, kicks, "4n")



function setup() {

  createCanvas(400, 400);

  startButton = createButton('start');
  stopButton = createButton('stop');
  startButton.position(0, 0);
  stopButton.position(0, 20);
  startButton.mousePressed(startSong);
  stopButton.mousePressed(stopSong);


  kicksPart.start(0);
  // synthPart.start(0);
  synthPartHigh.start(0);





}


function draw() {

  background(0);
  autoWah.baseFrequency = map(mouseX, 0, width, 300, 4000);

  fill('white');
  var x = map(drumSynth.envelope.value, 0, 1, 0, 200);
  ellipse(200, 200, x);






}


function startSong() {
  Tone.Transport.start();
  gain.gain.value = 1;

}

function stopSong() {
  Tone.Transport.stop();
  gain.gain.value = 0;


}