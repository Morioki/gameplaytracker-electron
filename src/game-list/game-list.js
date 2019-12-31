const stubData = require('../stub-data');

// DOM elements
const createNew = document.querySelector('#create-new');
const gameList = document.querySelector('.game-list');

// Launch new game window
createNew.addEventListener('click', e => {
	const gameRecordWindow = window.open('../../game-record/static/game-record.html', '', `
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

// Load Game Selector
const games = stubData.gameList;

games.forEach(game => {
	const gameItem = document.createElement('div');
	const nameSpan = document.createElement('span');
	const subDataDiv = document.createElement('div');
	const platformSpan = document.createElement('span');
	const releaseYearSpan = document.createElement('span');
	const dropDownDiv = document.createElement('div');

	gameItem.classList.add('game-item');
	nameSpan.classList.add('game-title');
	subDataDiv.classList.add('game-subdata');
	platformSpan.classList.add('platform');
	releaseYearSpan.classList.add('release-year');

	nameSpan.textContent = game.gameTitle;
	platformSpan.textContent = game.platform;
	releaseYearSpan.textContent = game.releaseYear;

	subDataDiv.append(platformSpan);
	subDataDiv.append(releaseYearSpan);

	gameItem.dataset.gameId = game.gameId;
	gameItem.dataset.platform = game.platform;
	gameItem.dataset.genre = game.genre;
	gameItem.dataset.releaseYear = game.releaseYear;
	gameItem.dataset.developer = game.developer;
	gameItem.dataset.publisher = game.publisher;
	gameItem.dataset.franchise = game.franchise;
	gameItem.dataset.series = game.series;
	gameItem.dataset.gameNote = game.gameNote;

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
		const gameRecordWindow = window.open('../../game-record/static/game-record.html', '', `
			maxWidth=600,
			maxHeight=600,
			width=300,
			height=400,
			backgroundColor=#DEDEDE,
			nodeIntegration=1
		`);

		// TODO Add Ipc Messaging to pass the selected item data to the new window

		// Remove at end
		console.log(gameItem.dataset.gameId);
		console.log(e);
		console.log(gameRecordWindow);
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

	gameItem.append(nameSpan);
	gameItem.append(subDataDiv);
	gameItem.append(dropDownDiv);

	gameList.append(gameItem);
});

console.log(createNew);
console.log(gameList);
console.log('Game List Loaded');
