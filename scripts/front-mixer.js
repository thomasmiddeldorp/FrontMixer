function FrontMixer(controls, audioContext, file) {
	this.controls = controls;
	this.file = file;

	this.controls.playElement.addEventListener('click', this.onPlayElementClick.bind(this));
	this.controls.stopElement.addEventListener('click', this.onStopElementClick.bind(this));
	this.controls.volumeFaderElement.addEventListener('input', this.onVolumeFaderElementInput.bind(this));

	this.context = new FrontMixerContext(audioContext);

	this.equalizer = new Equalizer(this.context, this.controls);

	this.equalizer.outputNode.connect(this.context.gainNode);
	this.context.gainNode.connect(this.context.audioContext.destination);
}

FrontMixer.prototype = {
	onPlayElementClick: function (event) {
		event.preventDefault();

		this.playAudio();
	},

	onStopElementClick: function (event) {
		event.preventDefault();

		this.stopAudio();
	},

	onVolumeFaderElementInput: function () {
		this.adjustVolume(this.controls.volumeFaderElement.value / 100);
	},

	loadAudio: function () {
		var request = new Request(this.file);

		return fetch(request).then(function (response) {
			return response.arrayBuffer();
		});
	},

	streamAudio: function () {
		var client = new BinaryClient('ws://localhost:9000');
		client.on('stream', function (stream) {

		});
	},

	playAudio: function () {
		var that = this;
		this.loadAudio().then(function (arrayBuffer) {
			that.context.audioContext.decodeAudioData(arrayBuffer, function (buffer) {
				that.context.source.buffer = buffer;
				that.context.source.start(0);
			});
		});
	},

	stopAudio: function () {
		if (this.context.source != null) {
			this.context.source.stop();
		}
	},

	adjustVolume: function (volumePercentage) {
		this.context.gainNode.gain.value = volumePercentage;
	}
};

function FrontMixerContext(audioContext) {
	this.audioContext = audioContext;
	this.gainNode = this.audioContext.createGain();
	this.source = this.audioContext.createBufferSource();
}