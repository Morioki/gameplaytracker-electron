// DOM Nodes
const playSession = document.querySelector('#play-session');
const gameRecord = document.querySelector('#game-record');

// Open new session window
playSession.addEventListener('click', e => {
	const playSessionWindow = window.open('../play-session/static/play-session.html', '', `
		maxWidth=600,
		maxHeight=600,
		width=300,
		height=300,
		backgroundColor=#DEDEDE,
		nodeIntegration=1
	`);

	// Remove at end
	console.log(e);
	console.log(playSessionWindow);
});

gameRecord.addEventListener('click', e => {
	const gameRecordWindow = window.open('../game-record/static/game-record.html', '', `
		maxWidth=600,
		maxHeight=600,
		width=300,
		height=400,
		backgroundColor=#DEDEDE,
		nodeIntegration=1
	`);

	// Remove at end
	console.log(e);
	console.log(gameRecordWindow)
})
