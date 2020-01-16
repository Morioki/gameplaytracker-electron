'use strict';
const {BrowserWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');
const {DateTime} = require('luxon');
const windowStateKeeper = require('electron-window-state');

const dbConn = require('../db/db-connection');
const stubData = require('../stub-data');

// DOM elements
const createNew = document.querySelector('#create-new');
const playSessionList = document.querySelector('.play-session-list');

let playSessionWindow;

const createPlaySessionWindow = async () => {
	
	const state = windowStateKeeper({
		defaultWidth: 600, defaultHeight: 600
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
		maxWidth: 600,
		maxHeight: 600,
		backgroundColor:'#DEDEDE',
		webPreferences: {nodeIntegration: true}
	});

	win.once('ready-to-show', () => {
		win.show();
	});

	win.once('closed', () => {
		playSessionWindow = undefined;
	});

	await win.loadFile('./src/play-session/static/play-session.html');

	state.manage(win);

	return win;
};

const createPlaySessionEditWindow = async (data) => {
	
	const state = windowStateKeeper({
		defaultWidth: 600, defaultHeight: 600
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
		maxWidth: 600,
		maxHeight: 600,
		backgroundColor:'#DEDEDE',
		webPreferences: {nodeIntegration: true}
	});

	win.once('ready-to-show', () => {
		win.show();
	});

	win.once('closed', () => {
		playSessionWindow = undefined;
	});

	await win.loadFile('./src/play-session-edit/static/play-session-edit.html');

	win.once('ready-to-show', () => {
		if (typeof data !== 'undefined') {
			ipcRenderer.sendTo(win.webContents.id, 'dataForSessionEdit', Object.assign({win}, data));
		}
		win.show();
	});

	state.manage(win);

	return win;
};

// Launch new session window
createNew.addEventListener('click', async e => {
	playSessionWindow = await createPlaySessionWindow();
});

// Load selectors
const playSessions = JSON.parse(window.localStorage.getItem('play-session-list'));
// const gameDataList = JSON.parse(window.localStorage.getItem('game-list'));

// if (typeof playSessions === 'undefined') {
// 	dbConn.loadAllPlaySessions();
// }

playSessions.forEach(sesh => {
	const sessionItem = document.createElement('div');
	const nameSpan = document.createElement('span');
	const dateSpan = document.createElement('span');
	const timePlayedSpan = document.createElement('span');
	const dropDownDiv = document.createElement('div');

	// Get Game Record for play Session
	// const gameData = gameDataList.find(game => game.game_id === sesh.game_id);

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

	nameSpan.textContent = sesh.game_id.game_title;

	sessionItem.dataset.session_id = sesh.gametime_id;
	sessionItem.dataset.game_id = sesh.game_id.game_id;
	
	const startDate = new Date(sesh.start_date).toISOString().slice(0,19).replace('T', ' ');
	const endDate = new Date(sesh.end_date).toISOString().slice(0,19).replace('T', ' ');
	
	dateSpan.textContent = DateTime.fromSQL(startDate).toLocaleString(DateTime.DATE_SHORT);

	const hours = Math.round(Math.abs(((DateTime.fromSQL(startDate) - DateTime.fromSQL(endDate)) / 3.6e6) * 100) + Number.EPSILON) / 100;

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
	edit.addEventListener('click', async () => {
		playSessionWindow = await createPlaySessionEditWindow(sessionItem.dataset);
	});

	const del = document.createElement('a');
	del.classList.add('dropdown-item');
	del.href = '#';
	del.textContent = 'Delete';
	del.addEventListener('click', async () => {
		//TODO Add Toast for delete (Indicating that not currently implemented)
		console.log('Deleted');
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

ipcRenderer.on('reloadWindowFlagSession', () => {
	require('electron').remote.getCurrentWindow().reload();
})

console.log('Play Session List Loaded');
