var	jq = chrome.extension.getBackgroundPage().$,
 	streams = chrome.extension.getBackgroundPage().streams,
	options = chrome.extension.getBackgroundPage().options;

function start() {
	$(document).ready(onload);
}	

function update() {
	var container = $('#streams', document);

	container.children().remove();

	for (var i in streams) {
		var stream = streams[i];

		container.append(
			template('stream_template', stream.title, stream.viewers, stream.user, stream.url, stream.logo)
				.addClass('stream_container'));
	}
}

function template(id) {
	var script = $('#' + id, document).text();

	for (var i = 1; i < arguments.length; i++) {
		script = script.replace('$' + i, arguments[i]);
	}

	return $('<div></div>')
		.append(script);
}

function onload() {
	update();

	$(document).on('click', 'a', function(){
		chrome.tabs.create({url: $(this).attr('href')});
	});
}

function bind() {
	$("#workers_list", document).mouseenter(function() {
		$("#content", document).addClass('workers_list_expanded');
	});

	$("#workers_list", document).mouseleave(function() {
		$("#content", document).removeClass('workers_list_expanded');
	});
}

start();

//--------------------------------------------------------------------------

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-41406389-3']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();