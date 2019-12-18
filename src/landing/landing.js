// DOM Nodes
const newSession = document.querySelector('#new-session');

// Open new session window
newSession.addEventListener('click', e => {
	const newSessionWindow = window.open('../play-session/static/play-session.html', '', `
		maxWidth=2000,
		maxHeight=2000,
		width=1200,
		height=800,
		backgroundColor=#DEDEDE,
		nodeIntegration=1
	`);

	// Remove at end
	console.log(e);
	console.log(newSessionWindow);
});
