'use strict';
const {BrowserWindow} = require('electron').remote;
const {DateTime} = require('luxon');
const windowStateKeeper = require('electron-window-state');

const stubData = require('../stub-data');

// DOM elements
const createNew = document.querySelector('#create-new');
const playSessionList = document.querySelector('.play-session-list');

// Load Play Session List Selector
const playSessions = stubData.playSessionList;
const gameDataList = stubData.gameList;

// Launch new session window
createNew.addEventListener('click', e => {
	const playSessionWindow = window.open('../../play-session/static/play-session.html', '', `
		maxWidth=600,
		maxHeight=600,
		width=300,
		height=400,
		backgroundColor=#DEDEDE,
		nodeIntegration=1
	`);

	// Remove at end
	console.log(e);
	console.log(playSessionWindow);
});

playSessions.forEach(sesh => {
	const sessionItem = document.createElement('div');
	const nameSpan = document.createElement('span');
	const dateSpan = document.createElement('span');
	const timePlayedSpan = document.createElement('span');
	const dropDownDiv = document.createElement('div');

	// Get Game Record for play Session
	const gameData = gameDataList.find(game => game.gameId === sesh.gameId);

	sessionItem.classList.add('session-item');
	sessionItem.classList.add('row');
	sessionItem.classList.add('p-1');

	dateSpan.classList.add('date-played');
	dateSpan.classList.add('col-2');
	dateSpan.classList.add('align-middle');

	nameSpan.classList.add('game-title');
	nameSpan.classList.add('game-subdata');
	nameSpan.classList.add('col-5');
	nameSpan.classList.add('align-middle');

	timePlayedSpan.classList.add('time-played');
	timePlayedSpan.classList.add('game-subdata');
	timePlayedSpan.classList.add('col');
	timePlayedSpan.classList.add('align-middle');

	nameSpan.textContent = gameData.gameTitle;
	dateSpan.textContent = DateTime.fromSQL(sesh.startDate).toLocaleString(DateTime.DATE_SHORT);

	const hours = Math.round(Math.abs(((DateTime.fromSQL(sesh.startDate) - DateTime.fromSQL(sesh.endDate)) / 3.6e6) * 100) + Number.EPSILON) / 100;

	timePlayedSpan.textContent = hours;

	// Build Dropdown Menu
	dropDownDiv.classList.add('btn-group');
	dropDownDiv.classList.add('dropleft');
	dropDownDiv.classList.add('col');

	const ddButton = document.createElement('button');
	ddButton.classList.add('btn');
	ddButton.classList.add('btn-secondary');
	ddButton.classList.add('dropdown-toggle');
	ddButton.type = 'button'
	ddButton.dataset.toggle = 'dropdown';
	ddButton.setAttribute('aria-haspopup', 'true');
	ddButton.setAttribute('aria-expanded', 'false');

	const ddItems = document.createElement('div');
	ddItems.classList.add('dropdown-menu');

	const edit = document.createElement('a');
	edit.classList.add('dropdown-item');
	edit.href = '#';
	edit.textContent = 'Edit';
	edit.addEventListener('click', e => {
		const gameSessionWindow = window.open('../../game-record/static/game-record.html', '', `
			maxWidth=600,
			maxHeight=600,
			width=300,
			height=400,
			backgroundColor=#DEDEDE,
			nodeIntegration=1
		`);

		// TODO Add Ipc Messaging to pass the selected item data to the new window

		// Remove at end
		console.log(e);
		console.log(gameSessionWindow);
	});

	const del = document.createElement('a');
	del.classList.add('dropdown-item');
	del.href = '#';
	del.textContent = 'Delete';
	del.addEventListener('click', e => {
		console.log('Deleted');
		console.log(e);
	});

	dropDownDiv.append(ddButton);
	ddItems.append(edit);
	ddItems.append(del);
	dropDownDiv.append(ddItems);

	sessionItem.append(dateSpan);
	sessionItem.append(nameSpan);
	sessionItem.append(timePlayedSpan);
	sessionItem.append(dropDownDiv);

	playSessionList.append(sessionItem);
});

console.log('Play Session List Loaded');
