function FrontMixer(controls, audioContext, file, mixer) {
	var that = this;
	this.audioContext = audioContext;
	this.mixer = mixer;
	this.controls = controls;
	this.file = file;
	this.state = {
		isChannel1Playing: false,
		isChannel2Playing: false
	};

	mixer.registerControl('channel1-play', this.onMixerPlay.bind(this));
	mixer.registerControl('channel1-cue', this.onCue.bind(this));
	mixer.registerControl('channel1-volume', this.onVolumeFaderElementExternalInput.bind(this));

	this.controls.playElement.addEventListener('click', this.onPlayElementClick.bind(this));
	this.controls.stopElement.addEventListener('click', this.onStopElementClick.bind(this));
	this.controls.volumeFaderElement.addEventListener('input', this.onVolumeFaderElementInput.bind(this));


	this.loadAudio().then(function(arrayBuffer) {
		that.audioBuffer = arrayBuffer;
		that.initAudio(that.audioBuffer);
		that.isInitialized = true;
		console.log('Initialized');
		document.querySelector('.loading-screen').classList.add('hidden');
	});
}

FrontMixer.prototype = {
	initAudio: function() {
		var that = this;
		console.log(document.querySelector('.loading-screen').classList);
		document.querySelector('.loading-screen').classList.remove('hidden');

		this.context = new FrontMixerContext(this.audioContext);

		this.context.source = this.context.audioContext.createBufferSource();
		console.time('init');
		this.context.audioContext.decodeAudioData(this.audioBuffer, function (buffer) {
			that.context.source.buffer = buffer;
			console.timeEnd('init');
			document.querySelector('.loading-screen').classList.add('hidden');
		});

		this.equalizer = new Equalizer(this.context, this.controls, this.mixer);
		this.distortion = this.context.audioContext.createWaveShaper();

		this.equalizer.outputNode.connect(this.context.gainNode);
		this.context.gainNode.connect(this.distortion);

		this.distortion.connect(this.context.audioContext.destination);
	},

	onMixerPlay: function (value) {
		if(value === 0) { // TODO make value translator
			return;
		}

		//if (this.state.isChannel1Playing) {
		//	this.stopAudio();
		//}
		//else {
			this.playAudio();
			document.querySelector('#play-left').classList.add('playing');
		//}
		this.state.isChannel1Playing = !this.state.isChannel1Playing;
	},

	onCue: function (value) {
		document.querySelector('#play-left').classList.remove('playing');
		if(value === 0) { // TODO make value translator
			document.querySelector('#stop-left').classList.remove('cue-press');
			return;
		}
		document.querySelector('#stop-left').classList.add('cue-press');


		this.stopAudio();
		this.initAudio();
	},

	onPlayElementClick: function (event) {
		event.preventDefault();

		this.playAudio();
	},

	onStopElementClick: function (event) {
		event.preventDefault();

		this.stopAudio();
	},

	onVolumeFaderElementExternalInput: function (value) {
		this.adjustVolume(value / 100);
		this.controls.volumeFaderElement.value = value;
	},

	onVolumeFaderElementInput: function () {
		this.adjustVolume(this.controls.volumeFaderElement.value / 100);
	},

	onDistortionInput: function () {
		this.adjustDistortion(this.controls.distortionElement);
	},

	loadAudio: function () {
		var request = new Request(this.file);

		return fetch(request).then(function (response) {
			return response.arrayBuffer();
		});
	},

	streamAudio: function () {
		var that = this;

		var client = new BinaryClient('ws://localhost:9000');
		client.on('stream', function (stream) {
			var arrayBuffer = [];

			var started = false;

			stream.on('data', function (chunk) {
				arrayBuffer.concat(chunk);

				if (!started) {
					that.context.audioContext.decodeAudioData(arrayBuffer, function (buffer) {
						that.context.source.buffer = buffer;
						that.context.source.start(0);
					});
				}
			});

			//that.context.audioContext.decodeAudioData(arrayBuffer, function (buffer) {
			//	that.context.source.buffer = buffer;
			//	that.context.source.start(0);
			//});

		});
	},

	playAudio: function () {
		if(this.isInitialized) {
			this.context.source.start(0);
		}
	},

	stopAudio: function () {
		if (this.context.source != null) {
			this.context.source.stop();
		}
	},

	adjustVolume: function (volumePercentage) {
		this.context.gainNode.gain.value = volumePercentage;
	},

	adjustDistortion: function (amount) {
		function makeDistortionCurve(amount) {
			var k = typeof amount === 'number' ? amount : 50,
				n_samples = 44100,
				curve = new Float32Array(n_samples),
				deg = Math.PI / 180,
				i = 0,
				x;
			for (; i < n_samples; ++i) {
				x = i * 2 / n_samples - 1;
				curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
			}
			return curve;
		}

		this.distortion.curve = makeDistortionCurve(amount);
		this.distortion.oversample = '4x';
	}
};

function FrontMixerContext(audioContext) {
	this.audioContext = audioContext;
	this.gainNode = this.audioContext.createGain();
	this.source = this.audioContext.createBufferSource();
}