function start() {
	$(document).ready(onload);
}

function loadOptions() {
	var apiKey = chrome.storage.sync.get('streams', function(value) {
		var streams = value.streams;

		for (var i in streams) {
			$('#' + streams[i]).attr('checked', true);
		}
	});
}	

function save() {
	chrome.storage.sync.set({
		'streams': getCheckedStreams()
	}, function() {
		alert('Saved!');
	});
}

function getCheckedStreams() {
	var streams = [];

	$(".stream_checkbox").each(function(elem) {
		var moi = $(this);

		if(moi.is(":checked")) {
			streams.push(moi.attr('id'));
		}
	});

	return streams;
}

function onload() {
	$("#save_button").click(save);

	loadOptions();
}

start();