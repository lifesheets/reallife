function getEnvironment() {
	if(mp.game && mp.game.joaat) return 'client';
    else if(mp.trigger) return 'cef';
}


var CEVENTS;
if (getEnvironment() == "cef") {

	CEVENTS = class extends EventTarge
}