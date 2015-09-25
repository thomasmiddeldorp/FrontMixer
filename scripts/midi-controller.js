MidiController = class MidiController {
	connect() {
		if (window.navigator && 'function' === typeof window.navigator.requestMIDIAccess) {
			return window.navigator.requestMIDIAccess();
		} else {
			throw 'No Web MIDI support';
		}
	}

	getInputs() {

	}
}