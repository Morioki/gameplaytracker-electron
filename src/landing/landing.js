const {BrowserWindow} = require('electron').remote;
const windowStateKeeper = require('electron-window-state');
const Mousetrap = require('mousetrap');

const dbConn = require('../db/db-connection');

// DOM Nodes
// const playSession = document.querySelector('#play-session');
// const gameRecord = document.querySelector('#game-record');
// const gameList = document.querySelector('#game-list');
// const playSessionList = document.querySelector('#play-session-list');
// const dbTest = document.querySelector('#db-test');

// Load Session Data for all windows
dbConn.loadAllData()

// konami code!
Mousetrap.bind('up up down down left right left right b a enter', () => {
	console.log('konami code')
  })

Mousetrap.bind('g', () =>{
	const gameListWindow = window.open('../game-list/static/game-list.html', '', `
		maxWidth=2000,
		maxHeight=2000,
		width=600,
		height=800,
		backgroundColor=#DEDEDE,
		nodeIntegration=1
	`);
	
	return false;
});

Mousetrap.bind('p', () => {
	const playSessionListWindow = window.open('../play-session-list/static/play-session-list.html', '', `
		maxWidth=2000,
		maxHeight=2000,
		width=600,
		height=800,
		backgroundColor=#DEDEDE,
		nodeIntegration=1
	`);	
	
	return false;
});

// TODO Build UI for Landing Page
//* Aggregate information. Top 5 games by hours played
//* Game Name | Release Year | Hours Played 

