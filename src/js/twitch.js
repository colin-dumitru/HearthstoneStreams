var isNotifyEnabled = false,
	options = null,
	notifyButton;

function hs_onload() {
	$('#channel_actions').append(createNotifyButton());

	chrome.storage.onChanged.addListener(optionsChangedListener);
	optionsChangedListener();	
}

function optionsChangedListener() {
	chrome.storage.sync.get('favourites', function(value) {
		options = value;
		isNotifyEnabled = !!options.favourites[document.URL];
		toggleNotifyStyle(notifyButton);
	});
}

function createNotifyButton() {
	notifyButton = $('<a></a>')
		.addClass('normal_button')
		.click(toggleNotify)
		.append(
			$('<span></span>')
				.append('Notify Me')
		);

	return toggleNotifyStyle(notifyButton);	
}

function toggleNotifyStyle(button) {
	if (isNotifyEnabled) {
		button
			.css('background', '-webkit-gradient(linear,left top,left bottom,from(#349449),to(#3EA354))')
			.css('color', 'white')
			.css('text-shadow', '0 1px 0 #676767');
	} else {
		button
			.css('background', '')
			.css('color', '')
			.css('text-shadow', '');
	}

	return button;
}

function toggleNotify() {
	isNotifyEnabled = !isNotifyEnabled;
	toggleNotifyStyle($(this));

	options.favourites[document.URL] = isNotifyEnabled;
	saveOptions();
}

function saveOptions() {
	chrome.storage.sync.set(options);
}

function hs_start() {
	$(document).ready(hs_onload);
}

hs_start();