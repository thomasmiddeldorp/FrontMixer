'use strict';

window.addEventListener('load', function () {
	var mixerLeft = new Mixer('channel1');
	var mixerRight = new Mixer('channel1');

	var midiController = new MidiController();
	var midiConnection = midiController.connect();

	midiConnection.then(function (midiAccess, midiOptions) {
		console.log(midiOptions);
		midiAccess.inputs.forEach(function (input) {
			input.onmidimessage = function (event) {
				mixerLeft.trigger(event.data[1], event.data[2]);
			};
		});
	}, function () {
		console.log('fail');
	});

	var audioContext = new AudioContext();

	var frontMixerLeft = new FrontMixer({
		playElement: document.getElementById('play-left'),
		stopElement: document.getElementById('stop-left'),
		volumeFaderElement: document.getElementById('volume-fader-left'),
		lowBandElement: document.getElementById('low-band-left'),
		highBandElement: document.getElementById('high-band-left')
	}, audioContext, 'audio/take.mp3', mixerLeft);

	var frontMixerRight = new FrontMixer({
		playElement: document.getElementById('play-right'),
		stopElement: document.getElementById('stop-right'),
		volumeFaderElement: document.getElementById('volume-fader-right'),
		lowBandElement: document.getElementById('low-band-right'),
		highBandElement: document.getElementById('high-band-right')
	}, audioContext, 'audio/take.mp3', mixerRight);
});