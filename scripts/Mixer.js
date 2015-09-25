Mixer = class Mixer {
	constructor() {
		this.MAPPING = {
			8: "channel1-play",
			50: "channel1-volume"
		};
		this.controls = {};
	}

	trigger(id, value) {
		let control = this.MAPPING[id];
		this.controls[control](value);
	}

	registerControl(name, callback) {
		this.controls[name] = callback;
	}
};