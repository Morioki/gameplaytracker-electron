'use strict';
const {BrowserWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');
const windowStateKeeper = require('electron-window-state');
// const dbConn = require('../db/db-connection');

const dbConn = require('../db/db-connection');
// const stubData = require('../stub-data');

// DOM elements
const createNew = document.querySelector('#create-new');
const gameList = document.querySelector('.game-list');

let gameRecordWindow;

const createGameRecordWindow = async (gameItem) => {
	const state = windowStateKeeper({
		defaultWidth: 300, defaultHeight: 400
	});

	const win = new BrowserWindow({
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

	// win.once('ready-to-show', () => {
	// 	win.show();
	// });

	win.once('closed', () => {
		gameRecordWindow = undefined;
	});

	await win.loadFile('./src/game-record/static/game-record.html')

	win.once('ready-to-show', () => {
		if (typeof gameItem !== 'undefined') {
			console.log(gameItem)
			ipcRenderer.sendTo(win.webContents.id, 'dataForGameRecord', Object.assign({win}, gameItem));
		}
		win.show();
	});

	state.manage(win);

	return win;
};

// Launch new game window
createNew.addEventListener('click', async e => { 
	gameRecordWindow = await createGameRecordWindow()
});

//Load Game Selector
const games = JSON.parse(window.localStorage.getItem('game-list'));

// if (typeof games === 'undefined') {
// 	dbConn.loadAllGames();
// }

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
	nameSpan.textContent = game.game_title;
	platformSpan.textContent = game.platform;
	releaseYearSpan.textContent = game.release_year;

	gameItem.dataset.game_id = game.game_id;
	gameItem.dataset.title = game.game_title;
	gameItem.dataset.platform = game.platform;
	gameItem.dataset.genre = game.genre;
	gameItem.dataset.release_year = game.release_year;
	gameItem.dataset.developer = game.developer;
	gameItem.dataset.publisher = game.publisher;
	gameItem.dataset.franchise = game.franchise;
	gameItem.dataset.series = game.series;
	gameItem.dataset.game_note = game.game_note;

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
	edit.addEventListener('click', async e => {
		gameRecordWindow = await createGameRecordWindow(gameItem.dataset);
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

ipcRenderer.on('reloadWindowFlag', () => {
	require('electron').remote.getCurrentWindow().reload();
});

console.log('Game List Loaded');
