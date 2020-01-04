'use strict';
const {BrowserWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');
const windowStateKeeper = require('electron-window-state');

const stubData = require('../stub-data');

// DOM elements
const createNew = document.querySelector('#create-new');
const gameList = document.querySelector('.game-list');

// Launch new game window
createNew.addEventListener('click', e => {
	// TODO Prevent Garbage Collection
	const state = windowStateKeeper({
		defaultWidth: 300, defaultHeight: 400
	});

	const gameRecordWindow = new BrowserWindow({
		parent: require('electron').remote.getCurrentWindow(),
		modal: true,
		show: false,
		x: state.x,
		y: state.y,
		width: state.width,
		height: state.height,
		minWidth: 300,
		maxWidth: 1000,
		minHeight: 400,
		backgroundColor: '#DEDEDE',
		webPreferences: {nodeIntegration: true}
	})
	gameRecordWindow.loadFile('./src/game-record/static/game-record.html')
	gameRecordWindow.once('ready-to-show', () => {
		gameRecordWindow.show();
	});

	state.manage(gameRecordWindow);

	// Remove at end
	console.log(e);
	console.log(gameRecordWindow.id);
});

// Load Game Selector
const games = stubData.gameList;

games.forEach((game, index) => {
	const gameItem = document.createElement('div');
	const indexSpan = document.createElement('span');
	const nameSpan = document.createElement('span');
	const platformSpan = document.createElement('span');
	const releaseYearSpan = document.createElement('span');
	const dropDownDiv = document.createElement('div');

	gameItem.classList.add('game-item');
	gameItem.classList.add('row');
	gameItem.classList.add('p-1');

	indexSpan.classList.add('game-index');
	indexSpan.classList.add('col-1');
	indexSpan.classList.add('align-middle');

	nameSpan.classList.add('game-title');
	nameSpan.classList.add('col-5');
	nameSpan.classList.add('align-middle');

	platformSpan.classList.add('game-subdata');
	platformSpan.classList.add('platform');
	platformSpan.classList.add('col');
	platformSpan.classList.add('align-middle');

	releaseYearSpan.classList.add('game-subdata');
	releaseYearSpan.classList.add('release-year');
	releaseYearSpan.classList.add('col');
	releaseYearSpan.classList.add('align-middle');

	indexSpan.textContent = index + 1;
	nameSpan.textContent = game.gameTitle;
	platformSpan.textContent = game.platform;
	releaseYearSpan.textContent = game.releaseYear;

	gameItem.dataset.gameId = game.gameId;
	gameItem.dataset.title = game.gameTitle;
	gameItem.dataset.platform = game.platform;
	gameItem.dataset.genre = game.genre;
	gameItem.dataset.releaseYear = game.releaseYear;
	gameItem.dataset.developer = game.developer;
	gameItem.dataset.publisher = game.publisher;
	gameItem.dataset.franchise = game.franchise;
	gameItem.dataset.series = game.series;
	gameItem.dataset.gameNote = game.gameNote;

	// Build Dropdown Menu
	dropDownDiv.classList.add('btn-group');
	dropDownDiv.classList.add('dropleft');
	dropDownDiv.classList.add('col');

	const ddButton = document.createElement('button');
	ddButton.classList.add('btn');
	ddButton.classList.add('btn-secondary');
	ddButton.classList.add('dropdown-toggle');
	ddButton.type = 'button'
	ddButton.dataset.toggle = 'dropdown'
	ddButton.setAttribute('aria-haspopup', 'true');
	ddButton.setAttribute('aria-expanded', 'false');

	const ddItems = document.createElement('div');
	ddItems.classList.add('dropdown-menu');

	const edit = document.createElement('a');
	edit.classList.add('dropdown-item');
	edit.href = '#';
	edit.textContent = 'Edit';
	edit.addEventListener('click', e => {
		const state = windowStateKeeper({
			defaultWidth: 300, defaultHeight: 400
		});
	
		const gameRecordWindow = new BrowserWindow({
			parent: require('electron').remote.getCurrentWindow(),
			modal: true,
			show: false,
			x: state.x,
			y: state.y,
			width: state.width,
			height: state.height,
			minWidth: 300,
			maxWidth: 1000,
			minHeight: 400,
			backgroundColor: '#DEDEDE',
			webPreferences: {nodeIntegration: true}
		})
		gameRecordWindow.loadFile('./src/game-record/static/game-record.html')
		gameRecordWindow.once('ready-to-show', () => {
			ipcRenderer.sendTo(gameRecordWindow.webContents.id, 'dataForGameRecord', Object.assign({gameRecordWindow}, gameItem.dataset));
			gameRecordWindow.show();
		});
	
		state.manage(gameRecordWindow);
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

	gameItem.append(indexSpan);
	gameItem.append(nameSpan);
	gameItem.append(platformSpan);
	gameItem.append(releaseYearSpan);
	gameItem.append(dropDownDiv);

	gameList.append(gameItem);
});

console.log(createNew);
console.log(gameList);
console.log('Game List Loaded');
