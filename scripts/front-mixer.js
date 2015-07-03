function FrontMixer(controls) {
	this.controls = controls;

	this.controls.playElement.addEventListener('click', this.onPlayElementClick.bind(this));
	this.controls.stopElement.addEventListener('click', this.onStopElementClick.bind(this));
	this.controls.volumeFaderElement.addEventListener('input', this.onVolumeFaderElementInput.bind(this));

	this.context = new FrontMixerContext();

	this.equalizer = new Equalizer(this.context);

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
		var request = new Request('audio/kathedraal.mp3');

		return fetch(request).then(function (response) {
			return response.arrayBuffer();
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

function FrontMixerContext() {
	this.audioContext = new AudioContext();
	this.gainNode = this.audioContext.createGain();
	this.source = this.audioContext.createBufferSource();
}