// DOM Nodes
const playSession = document.querySelector('#play-session');
const gameRecord = document.querySelector('#game-record');
const gameList = document.querySelector('#game-list');
const playSessionList = document.querySelector('#play-session-list');
const dbTest = document.querySelector('#db-test');

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
	console.log(gameRecordWindow);
});

gameList.addEventListener('click', e => {
	const gameListWindow = window.open('../game-list/static/game-list.html', '', `
		maxWidth=2000,
		maxHeight=2000,
		width=600,
		height=800,
		backgroundColor=#DEDEDE,
		nodeIntegration=1
	`);

	// Remove at end
	console.log(e);
	console.log(gameListWindow);
});

playSessionList.addEventListener('click', e => {
	const playSessionListWindow = window.open('../play-session-list/static/play-session-list.html', '', `
		maxWidth=2000,
		maxHeight=2000,
		width=600,
		height=800,
		backgroundColor=#DEDEDE,
		nodeIntegration=1
	`);

	// Remove at end
	console.log(e);
	console.log(playSessionListWindow);
});

dbTest.addEventListener('click', e => {
	const dbWindow = window.open('../db/test-db.html', '', `
		maxWidth=2000,
		maxHeight=2000,
		width=600,
		height=800,
		backgroundColor=#DEDEDE,
		nodeIntegration=1
	`);

	// Remove at end
	console.log(e);
	console.log(dbWindow);
});
