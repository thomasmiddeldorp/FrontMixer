Mixer = class Mixer {
	constructor(mixerId) {
		this.MAPPING = {
			8: mixerId + '-play',
			50: mixerId + '-volume',
			48: mixerId + '-eq-high',
			46: mixerId + '-eq-low'
		};
		this.controls = {};
	}

	trigger(id, value) {
		console.log(id);
		console.log(value);

		let control = this.MAPPING[id];
		this.controls[control](value);
	}

	registerControl(name, callback) {
		this.controls[name] = callback;
	}
};