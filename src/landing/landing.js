// DOM Nodes
const newSession = document.querySelector('#new-session');

// Open new session window
newSession.addEventListener('click', e => {
	const newSessionWindow = window.open('../play-session/static/play-session.html', '', `
		maxWidth=600,
		maxHeight=600,
		width=300,
		height=300,
		backgroundColor=#DEDEDE,
		nodeIntegration=1
	`);

	// Remove at end
	console.log(e);
	console.log(newSessionWindow);
});
