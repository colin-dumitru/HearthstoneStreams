var CLIENT_ID = '4vuxrrhrnica3vvknwc11jdy1k07oum',
	previousStreams = [],
	streams = [],
	streamsRemaining = 0,
	options = {},

	streamToBinder = {
		'twitch' : getTwitchStreams
	};

function optionsChangedListener() {
	chrome.storage.sync.get(['streams', 'favourites'], function(value) {
		options = value;

		if(!options.streams || !options.favourites) {
			createDefaultStreams();
		}
		getStreams();
	});
}

function createDefaultStreams() {
	options = {
		streams : options.streams || ['twitch'],
		favourites : options.favourites || {}
	}
	chrome.storage.sync.set(options);
}

function getStreams() {
	previousStreams = streams.map(function(stream) { return stream.url });
	streams = [];
	streamsRemaining = options.streams.length;

	for (var stream_id in options.streams) {
		streamToBinder[options.streams[stream_id]]();
	}
}

// -------------------------- Twitch specific -------------------------------

function getTwitchStreams() {
	//todo remove dependency to jquery
	$.ajax({
		type: 'GET',
		url: 'https://api.twitch.tv/kraken/streams.json?game=Hearthstone%3A%20Heroes%20of%20Warcraft',
		headers: {
			Accept: 'application/vnd.twitchtv.v2+json'
		},
		success: function(newData) {
			streams = newData.streams.map(twitchJsonToStream);
			sendData();
		},
		error: function() {
			//todo
		}
	});
}

function twitchJsonToStream(json) {
	return {
		title : json.channel.status,
		logo : json.preview,
		viewers : json.viewers,
		user : json.channel.display_name,
		url : json.channel.url
	}
}

// ---------------------------------------------------------------------------

function sendData() {
	/*Only update popup if all the pages have finished loading*/
	if(--streamsRemaining) {
		return;
	}

	chrome.browserAction.setBadgeText({text: String(streams.length)});

	sendDataToView();
	checkForNotifications();
}

function checkForNotifications() {
	for (var i in streams) {
		var stream = streams[i];

		if(options.favourites[stream.url] && previousStreams.indexOf(stream.url) == -1) {
			showStreamNotification(stream);
		}
	}
}

function showStreamNotification(stream) {
	chrome.notifications.create(stream.url, {
		type: "basic",
		title: stream.user + " went online!",
		message: "A stream you are watching has gone online!",
		iconUrl: "icon48.png",
		buttons: [{ title: 'View Stream'}]
	}, function() {
	});
}

function sendDataToView() {
	var views = chrome.extension.getViews();

	for (var i = 0; i < views.length; i++) {
		var view = views[i];

		view.streams = streams;
		view.options = options;

		if(view.update) {
			view.update();
		};
	}
}

function run() {
	chrome.storage.onChanged.addListener(optionsChangedListener);
	optionsChangedListener();	

	window.setInterval(getStreams, 5000);

	chrome.notifications.onButtonClicked.addListener(function(notifId) {
	    chrome.tabs.create({url: notifId});		
	});
}

run();