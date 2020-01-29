'use strict';
const {BrowserWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');
const {DateTime} = require('luxon');
const windowStateKeeper = require('electron-window-state');
const _ = require('lodash');

// DOM elements
const createNew = document.querySelector('#create-new');
const playSessionList = document.querySelector('.play-session-list');

// Prevent Window from being garbage collected
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
		backgroundColor: '#DEDEDE',
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

const createPlaySessionEditWindow = async data => {
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
		backgroundColor: '#DEDEDE',
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
createNew.addEventListener('click', async () => {
	playSessionWindow = await createPlaySessionWindow();
});

// Load selectors
const playSessions = JSON.parse(window.localStorage.getItem('play-session-list'));
const sortedSessions = _.reverse(_.sortBy(playSessions, 'start_date'));
const groupedSessions = _.groupBy(sortedSessions, 'game_id.game_title');

_.each(groupedSessions, (value, key) => {
	const card = document.createElement('div');
	card.classList.add('card');

	const card_header_div = document.createElement('card-header');
	card_header_div.id = 'heading' + key.replace(/ /g, '');

	const card_header_h5 = document.createElement('h5');
	card_header_h5.classList.add('mb-0');

	const card_header_btn = document.createElement('button');
	card_header_btn.classList.add('btn');
	card_header_btn.classList.add('btn-secondary');
	card_header_btn.classList.add('btn-block');
	card_header_btn.dataset.toggle = 'collapse';
	card_header_btn.dataset.target = '#collapse' + key.replace(/ /g, '');
	card_header_btn.setAttribute('aria-expanded', 'false');
	card_header_btn.setAttribute('aria-controls', 'collapse' + key.replace(/ /g, ''));
	card_header_btn.textContent = key;

	const collapse_region = document.createElement('div');
	collapse_region.classList.add('collapse');
	collapse_region.id = 'collapse' + key.replace(/ /g, '');
	collapse_region.setAttribute('aria-labelledby', 'heading' + key.replace(/ /g, ''));
	collapse_region.dataset.parent = '#accordion';

	const card_body = document.createElement('div');
	card_body.classList.add('card-body');

	value.forEach(sesh => {
		const sessionItem = document.createElement('div');
		const nameSpan = document.createElement('span');
		const dateSpan = document.createElement('span');
		const timePlayedSpan = document.createElement('span');
		const dropDownDiv = document.createElement('div');

		sessionItem.classList.add('session-item');
		sessionItem.classList.add('row');
		sessionItem.classList.add('p-1');

		dateSpan.classList.add('date-played');
		dateSpan.classList.add('col-3');
		dateSpan.classList.add('align-middle');

		nameSpan.classList.add('game-title');
		nameSpan.classList.add('game-subdata');
		nameSpan.classList.add('col-5');
		nameSpan.classList.add('align-middle');

		timePlayedSpan.classList.add('time-played');
		timePlayedSpan.classList.add('game-subdata');
		timePlayedSpan.classList.add('col-2');
		timePlayedSpan.classList.add('align-middle');

		nameSpan.textContent = sesh.game_id.game_title;

		sessionItem.dataset.session_id = sesh.gametime_id;
		sessionItem.dataset.game_id = sesh.game_id.game_id;
		sessionItem.dataset.note = sesh.note;

		const startDate = DateTime.fromISO(sesh.start_date);
		const endDate = DateTime.fromISO(sesh.end_date);

		dateSpan.textContent = startDate.toLocaleString(DateTime.DATE_SHORT);

		const hours = Math.round(Math.abs(((startDate - endDate) / 3.6e6) * 100) + Number.EPSILON) / 100;

		timePlayedSpan.textContent = hours;

		// Build Dropdown Menu
		dropDownDiv.classList.add('btn-group');
		dropDownDiv.classList.add('dropleft');
		dropDownDiv.classList.add('col-2');

		const ddButton = document.createElement('button');
		ddButton.classList.add('btn');
		ddButton.classList.add('btn-secondary');
		ddButton.classList.add('dropdown-toggle');
		ddButton.type = 'button';
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

		card_body.append(sessionItem);
	});

	card_header_h5.append(card_header_btn);
	card_header_div.append(card_header_h5);
	card.append(card_header_div);

	collapse_region.append(card_body);
	card.append(collapse_region);

	playSessionList.append(card);
});

ipcRenderer.on('reloadWindowFlagSession', () => {
	playSessionWindow.reload();
	require('electron').remote.getCurrentWindow().reload();
});
