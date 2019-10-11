

//scene globals
let video;
let poseNet;
let poses = [];

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
const cymNotes = ['A4'];
const snareNotes = [null, 'Bb4', null, 'Bb4'];

/////////////////////////////
//sequences
////////////////////////////
const synthPart = new Tone.Sequence(function (time, note) {
  synth.triggerAttackRelease(note, '10hz', time, 1);
}, notes, "8n")

const kicksPart = new Tone.Sequence(function (time, note) {
  drumSynth.triggerAttackRelease(note, '8n', time, 0.5);

  Tone.Draw.schedule(function () {
    fill('white');
  })
}, kicks, "4n")

const cymPart = new Tone.Sequence(function (time, note) {
  sampler.triggerAttackRelease(note, '32n', time, 1);
}, cymNotes, "4n");

const snarePart = new Tone.Sequence(function (time, note) {
  snareSynth.triggerAttackRelease(note, '16n', time, 1);

}, snareNotes, '4n')






function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function (results) {
    poses = results;
    synthPart.start(0);
    kicksPart.start(0);
    cymPart.start(0);
    snarePart.start(0)
    Tone.Transport.start("+0.1");
  });
  video.hide();


  startButton = createButton('start');
  stopButton = createButton('stop');
  startButton.position(0, 0);
  stopButton.position(0, 20);
  startButton.mousePressed(startSong);
  stopButton.mousePressed(stopSong);






}

function modelReady() {
  console.log(poses)
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  if (poses.length > 0) {
    // console.log(poses[0].pose.keypoints)
  }
  evalKeyPoints();
}

// A function to draw ellipses over the detected keypoints
function evalKeyPoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];

      // draw eyes
      if (keypoint.score > 0.2 && (keypoint.part === 'rightEye' || keypoint.part === 'leftEye')) {
        // console.log(keypoint)
        fill(255, 0, 0);
        noStroke();
        var x = map(drumSynth.envelope.value, 0, 1, 0, 200);
        if (drumSynth.volume.value > -30) {
          ellipse(keypoint.position.x, keypoint.position.y, x, x);
        } else {
          ellipse(keypoint.position.x, keypoint.position.y, 20, 20);
        }
      }

      //control drums with left wrist
      if (keypoint.score > 0.2 && keypoint.part === 'leftWrist') {
        if (keypoint.position.y < height / 2) {
          drumSynth.volume.value = 0;
        } else {
          drumSynth.volume.value = -60;
        }
      }

      //control with right wrist
      if (keypoint.score > 0.2 && keypoint.part === 'rightWrist') {
        if (keypoint.position.y < height / 3) {
          // autoFilter.baseFrequency = 3000;
          autoFilter.baseFrequency = map(keypoint.position.y, 0, 2 * height / 3, 7000, 300);
          snareSynth.pitchDecay = map(keypoint.position.y, 0, 2 * height / 3, 0.5, 0.05);
          // console.log(snareSynth.pitchDecay)
        } else {
          autoFilter.baseFrequency = 400;
          snareSynth.pitchDecay = 0.05;
        }
      }
    }
  }
}



function startSong() {
  Tone.Transport.start();


}

function stopSong() {
  Tone.Transport.stop();

}