// instrument options
const drumSynthOptions = {
	pitchDecay: 0.05,
	octaves: 10,
	oscillator: {
		type: "sine"
	},
	envelope: {
		attack: 0.001,
		decay: 0.4,
		sustain: 0.09,
		release: 2.4,
		attackCurve: "exponential"
	}
}

const wahOptions = {
	baseFrequency: 100,
	octaves: 8,
	sensitivity: 0,
	Q: 2,
	gain: 2,
	follower: {
		attack: 0.3,
		release: 0.5
	}
}



//instruments
const synth = new Tone.DuoSynth();
const synth2 = new Tone.DuoSynth();
const kickSynth = new Tone.MembraneSynth(drumSynthOptions);

//effects
const autoWah = new Tone.AutoWah(wahOptions);
const reverb = new Tone.FeedbackDelay('8n', '0.4');

// routing
synth2.connect(reverb);
reverb.toMaster();
// synth.connect(autoWah);
synth.toMaster();
kickSynth.toMaster();

// note patterns
const notes = [null, ["Eb3", "C2"], null, ["Bb3", "G3"]];
const notes2 = ['C5'];
const kicks = ["C1", null];


//seuqences
const synthPart = new Tone.Sequence(function (time, note) {
	synth.triggerAttackRelease(note, '10hz', time);
}, notes, "8n")

const synthPartHigh = new Tone.Sequence(function (time, note) {
	synth2.triggerAttackRelease(note, '10hz', time);
}, notes2, "2n")

const kickDrumSequence = new Tone.Sequence((time, note) => {
	kickSynth.triggerAttackRelease(note, '10hz', time);
}, kicks, "8n");

////////////////////////////////

function setup() {
	createCanvas(720, 720);
	noStroke();

}

function draw() {
	background(100);
}

function mousePressed() {
	synthPart.start();
	kickDrumSequence.start();
	Tone.Transport.start();
}
