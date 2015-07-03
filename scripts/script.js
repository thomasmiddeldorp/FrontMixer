window.addEventListener('load', function () {
	var audioContext = new AudioContext();

	var frontMixerLeft = new FrontMixer({
		playElement: document.getElementById('play-left'),
		stopElement: document.getElementById('stop-left'),
		volumeFaderElement: document.getElementById('volume-fader-left'),
		lowBandElement: document.getElementById('low-band-left'),
		highBandElement: document.getElementById('high-band-left')
	}, audioContext, 'audio/my-empty-bottle.mp3');

	var frontMixerRight = new FrontMixer({
		playElement: document.getElementById('play-right'),
		stopElement: document.getElementById('stop-right'),
		volumeFaderElement: document.getElementById('volume-fader-right'),
		lowBandElement: document.getElementById('low-band-right'),
		highBandElement: document.getElementById('high-band-right')
	}, audioContext, 'audio/unleash-the-beast.mp3');
});