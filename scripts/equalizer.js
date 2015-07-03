function Equalizer(context) {
	this.context = context;

	this.lowBandElement = document.getElementById('low-band');
	this.highBandElement = document.getElementById('high-band');

	this.lowBandElement.addEventListener('input', this.onLowBandInput.bind(this));
	this.highBandElement.addEventListener('input', this.onHighBandInput.bind(this));

	var lowBand = new EqualizerBand('lowshelf', this.context.audioContext);
	lowBand.setFrequency(500);

	var highBand = new EqualizerBand('highshelf', this.context.audioContext);
	highBand.setFrequency(500);

	this.bands = {
		low: lowBand,
		//mid: new EqualizerBand('bandpass', context.audioContext),
		high: highBand
	};

	this.context.source.connect(lowBand.filter);
	lowBand.filter.connect(highBand.filter);

	this.outputNode = highBand.filter;
}

Equalizer.prototype = {
	onLowBandInput: function () {
		this.bands.low.adjustVolume(parseFloat(this.lowBandElement.value));
	},

	onHighBandInput: function () {
		this.bands.high.adjustVolume(parseFloat(this.highBandElement.value));
	}
};

function EqualizerBand(type, audioContext) {
	this.filter = audioContext.createBiquadFilter();
	this.filter.type = type;
}

EqualizerBand.prototype = {
	adjustVolume: function (volumePercentage) {
		this.filter.gain.value = volumePercentage;
	},

	setFrequency: function (frequency) {
		this.filter.frequency.value = frequency;
	}
};