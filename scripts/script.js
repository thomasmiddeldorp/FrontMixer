window.addEventListener('load', function () {
	var frontMixer = new FrontMixer({
		playElement: document.getElementById('play'),
		stopElement: document.getElementById('stop'),
		volumeFaderElement: document.getElementById('volume-fader')
	});
});