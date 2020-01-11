const {BrowserWindow} = require('electron').remote;
const windowStateKeeper = require('electron-window-state');

const dbConn = require('../db/db-connection');

// DOM Nodes
const playSession = document.querySelector('#play-session');
const gameRecord = document.querySelector('#game-record');
const gameList = document.querySelector('#game-list');
const playSessionList = document.querySelector('#play-session-list');
const dbTest = document.querySelector('#db-test');

// Load Session Data for all windows
dbConn.loadAllData()

gameList.addEventListener('click', async e => {
	const gameListWindow = window.open('../game-list/static/game-list.html', '', `
		maxWidth=2000,
		maxHeight=2000,
		width=600,
		height=800,
		backgroundColor=#DEDEDE,
		nodeIntegration=1
	`);
});

playSessionList.addEventListener('click', async e => {
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
