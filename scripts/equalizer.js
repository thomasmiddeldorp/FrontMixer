function Equalizer() {
	this.bands = {};
}

Equalizer.prototype = {
	addBand: function (band) {
		this.bands[band.id] = band;
	}
};

function EqualizerBand() {

}

EqualizerBand.prototype = {
	setRange: function (min, max) {

	}
};