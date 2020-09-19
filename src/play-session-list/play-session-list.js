'use strict';
const {BrowserWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');
const {DateTime} = require('luxon');
const Mousetrap = require('mousetrap');
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

	await win.loadFile('./src/new-play-session/new-play-session.html');

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
		minHeight: 360,
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

	await win.loadFile('./src/play-session-edit/play-session-edit.html');

	win.once('ready-to-show', () => {
		if (typeof data !== 'undefined') {
			ipcRenderer.sendTo(win.webContents.id, 'dataForSessionEdit', Object.assign({win}, data));
		}

		win.show();
	});

	state.manage(win);

	return win;
};

const createManualPlaySessionWindow = async data => {
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
		minHeight: 360,
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

	await win.loadFile('./src/manual-play-session/manual-play-session.html');

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

Mousetrap.bind('d', async () => {
	playSessionWindow = await createManualPlaySessionWindow();

	return false;
});

// Load selectors
const playSessions = JSON.parse(window.localStorage.getItem('play-session-list'));
const sortedSessions = _.reverse(_.sortBy(playSessions, 'start_date'));
const groupedSessions = _.groupBy(sortedSessions, 'game_id.game_title');

_.each(groupedSessions, (value, key) => {
	const card = document.createElement('div');
	card.classList.add('card');

	const card_header_div = document.createElement('card-header');
	card_header_div.id = 'heading' + key.replace(/ |:/gi, '');

	const card_header_h5 = document.createElement('h5');
	card_header_h5.classList.add('mb-0');

	const card_header_btn = document.createElement('button');
	card_header_btn.classList.add('btn');
	card_header_btn.classList.add('btn-secondary');
	card_header_btn.classList.add('btn-block');
	card_header_btn.dataset.toggle = 'collapse';
	card_header_btn.dataset.target = '#collapse' + key.replace(/ |:/gi, '');
	card_header_btn.setAttribute('aria-expanded', 'false');
	card_header_btn.setAttribute('aria-controls', 'collapse' + key.replace(/ |:/gi, ''));
	card_header_btn.textContent = key;

	const collapse_region = document.createElement('div');
	collapse_region.classList.add('collapse');
	collapse_region.id = 'collapse' + key.replace(/ |:/gi, '');
	collapse_region.setAttribute('aria-labelledby', 'heading' + key.replace(/ |:/gi, ''));
	collapse_region.dataset.parent = '#accordion';

	const card_body = document.createElement('div');
	card_body.classList.add('card-body');
	card_body.classList.add('p-2');

	const session_table = document.createElement('table');
	session_table.classList.add('table');
	session_table.classList.add('table-sm');
	session_table.classList.add('table-hover');

	// Table Header Begin
	const table_head = document.createElement('thead');
	const table_row = document.createElement('tr');

	const col_num = document.createElement('th');
	col_num.scope = 'col';
	col_num.classList.add('w-10');
	col_num.textContent = '#';
	table_row.append(col_num);

	const col_date = document.createElement('th');
	col_date.scope = 'col';
	col_date.classList.add('w-20');
	col_date.textContent = 'Date';
	table_row.append(col_date);

	const col_note = document.createElement('th');
	col_note.scope = 'col';
	col_note.classList.add('w-50');
	col_note.textContent = 'Note';
	table_row.append(col_note);

	const col_genre = document.createElement('th');
	col_genre.scope = 'col';
	col_genre.textContent = 'Time';
	col_genre.classList.add('w-15');
	table_row.append(col_genre);

	const col_menu = document.createElement('th');
	col_menu.scope = 'col';
	table_row.append(col_menu);

	table_head.append(table_row);
	session_table.append(table_head);
	// Table Header Eend

	// Table Body Begin
	const table_body = document.createElement('tbody');

	// Table Row Loop Being
	value.forEach((sesh, index) => {
		const session_item = document.createElement('tr');
		const row_num = document.createElement('th');
		const row_date = document.createElement('td');
		const row_note = document.createElement('td');
		const row_time = document.createElement('td');
		const row_dd = document.createElement('td');

		row_num.scope = 'row';
		row_num.textContent = index + 1;
		row_num.classList.add('align-middle');
		session_item.append(row_num);

		const startDate = DateTime.fromISO(sesh.start_date);
		const endDate = DateTime.fromISO(sesh.end_date);

		let hr;
		let min;
		let sec;
		let milli;
		if (sesh.hours === undefined) {
			let diff = Math.abs(endDate - startDate) / 1000;

			hr = Math.floor(diff / 3600) % 24;
			diff -= hr * 3600;

			min = Math.floor(diff / 60) % 60;
			diff -= min * 60;

			diff *= 1000;
			sec = Math.floor(diff / 1000) % 60;
			diff -= sec * 1000;

			milli = Math.trunc(diff);
		} else {
			hr = sesh.hours;
			min = sesh.minutes;
			sec = sesh.seconds;
			milli = sesh.milliseconds;
		}

		row_date.textContent = startDate.toLocaleString(DateTime.DATE_SHORT);
		row_date.classList.add('align-middle');
		session_item.append(row_date);

		row_note.textContent = sesh.note;
		row_note.classList.add('align-middle');
		row_note.classList.add('text-truncate');
		session_item.append(row_note);

		const totalMilli = (hr * 3.6e6) + (min * 60000) + (sec * 1000) + milli;
		const timePlayed = Math.round(Math.abs((totalMilli / 3.6e6) * 100) + Number.EPSILON) / 100;

		row_time.textContent = timePlayed;
		row_time.classList.add('align-middle');
		session_item.append(row_time);

		session_item.dataset.session_id = sesh.gametime_id;
		session_item.dataset.game_id = sesh.game_id.game_id;
		session_item.dataset.note = sesh.note;
		session_item.dataset.hours = hr;
		session_item.dataset.minutes = min;
		session_item.dataset.seconds = sec;
		session_item.dataset.milliseconds = milli;

		// Build Dropdown Menu
		row_dd.classList.add('btn-group');
		row_dd.classList.add('dropleft');

		const ddButton = document.createElement('button');
		ddButton.classList.add('btn');
		ddButton.classList.add('btn-sm');
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
			playSessionWindow = await createPlaySessionEditWindow(session_item.dataset);
		});

		const del = document.createElement('a');
		del.classList.add('dropdown-item');
		del.href = '#';
		del.textContent = 'Delete';
		del.addEventListener('click', async () => {
			console.log('Deleted');
		});

		row_dd.append(ddButton);
		ddItems.append(edit);
		ddItems.append(del);
		row_dd.append(ddItems);

		session_item.append(row_dd);

		table_body.append(session_item);
	});
	// Table Row Loop End

	session_table.append(table_body);
	// Table Body End

	card_body.append(session_table);

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
