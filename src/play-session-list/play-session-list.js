const {DateTime} = require('luxon');
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
	// TODO Add rendering of each data element
	const sessionItem = document.createElement('div');
	const nameSpan = document.createElement('span');
	const subDataDiv = document.createElement('div');
	const dateSpan = document.createElement('span');
	const timePlayedSpan = document.createElement('span');
	const dropDownDiv = document.createElement('div');

	// Get Game Record for play Session
	const gameData = gameDataList.find(game => game.gameId === sesh.gameId);

	sessionItem.classList.add('session-item');
	dateSpan.classList.add('date-played');
	subDataDiv.classList.add('session-subdata');
	nameSpan.classList.add('game-title');
	timePlayedSpan.classList.add('time-played');

	nameSpan.textContent = gameData.gameTitle;
	dateSpan.textContent = sesh.startDate;

	const hours = Math.round(Math.abs(((DateTime.fromSQL(sesh.startDate) - DateTime.fromSQL(sesh.endDate)) / 3.6e6) * 100) + Number.EPSILON) / 100;

	timePlayedSpan.textContent = hours;

	subDataDiv.append(nameSpan);
	subDataDiv.append(timePlayedSpan);

	// Build Dropdown Menu
	dropDownDiv.classList.add('dropdown');

	const ddButton = document.createElement('button');
	ddButton.classList.add('dropbtn');
	ddButton.textContent = '+';

	const ddItems = document.createElement('div');
	ddItems.classList.add('dropdown-content');

	const edit = document.createElement('a');
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
	sessionItem.append(subDataDiv);
	sessionItem.append(dropDownDiv);

	playSessionList.append(sessionItem);
});

console.log('Play Session List Loaded');
