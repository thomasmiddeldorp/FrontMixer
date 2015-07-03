function FrontMixer(controls) {
	this.controls = controls;

	this.controls.playElement.addEventListener('click', this.onPlayElementClick.bind(this));
	this.controls.stopElement.addEventListener('click', this.onStopElementClick.bind(this));
	this.controls.volumeFaderElement.addEventListener('input', this.onVolumeFaderElementInput.bind(this));

	this.audioContext = new AudioContext();
	this.gainNode = null;
	this.source = null;
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
		this.adjustVolume(this.controls.volumeFaderElement.value);
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
			that.audioContext.decodeAudioData(arrayBuffer, function (buffer) {
				that.gainNode = that.audioContext.createGain();
				that.source = that.audioContext.createBufferSource();
				that.source.buffer = buffer;

				that.source.connect(that.gainNode);
				that.gainNode.connect(that.audioContext.destination);

				that.source.start(0);
			});
		});
	},

	stopAudio: function () {
		if (this.source != null) {
			this.source.stop();
		}
	},

	adjustVolume: function(volumePercentage) {
		this.gainNode.gain.value = volumePercentage / 100;
	}
};