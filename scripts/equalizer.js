function Equalizer(context, controls, mixer) {
	this.context = context;
	this.controls = controls;

	this.lowBandElement = this.controls.lowBandElement;
	this.highBandElement = this.controls.highBandElement;

	mixer.registerControl('channel1-eq-high', this.onHighBandExternalInput.bind(this));
	mixer.registerControl('channel1-eq-low', this.onLowBandExternalInput.bind(this));

	this.lowBandElement.addEventListener('input', this.onLowBandInput.bind(this));
	this.highBandElement.addEventListener('input', this.onHighBandInput.bind(this));

	var lowBand = new EqualizerBand('lowshelf', this.context.audioContext);
	lowBand.setFrequency(500);

	var highBand = new EqualizerBand('highshelf', this.context.audioContext);
	highBand.setFrequency(500);

	this.bands = {
		low: lowBand,
		high: highBand
	};

	this.context.source.connect(lowBand.filter);
	lowBand.filter.connect(highBand.filter);

	this.outputNode = highBand.filter;
}

Equalizer.prototype = {
	onLowBandExternalInput: function (value) {
		this.bands.low.adjustVolume(parseFloat(value - 63));
		this.lowBandElement.value = value;
	},

	onLowBandInput: function () {
		this.bands.low.adjustVolume(parseFloat(this.lowBandElement.value - 63));
	},

	onHighBandExternalInput: function (value) {
		this.bands.high.adjustVolume(parseFloat(value - 63));
		this.highBandElement.value = value;
	},

	onHighBandInput: function () {
		this.onHighBandInput(parseFloat(this.highBandElement.value));
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