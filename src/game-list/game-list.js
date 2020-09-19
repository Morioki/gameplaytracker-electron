'use strict';
const {BrowserWindow} = require('electron').remote;
const {ipcRenderer} = require('electron');
const windowStateKeeper = require('electron-window-state');
const _ = require('lodash');

// DOM elements
const createNew = document.querySelector('#create-new');
const gameList = document.querySelector('.game-list');

let gameRecordWindow;

const createGameRecordWindow = async gameItem => {
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
	});

	win.once('ready-to-show', () => {
		win.show();
	});

	win.once('closed', () => {
		gameRecordWindow = undefined;
	});

	await win.loadFile('./src/game-record/game-record.html');

	win.once('ready-to-show', () => {
		if (typeof gameItem !== 'undefined') {
			ipcRenderer.sendTo(win.webContents.id, 'dataForGameRecord', Object.assign({win}, gameItem));
		}

		win.show();
	});

	state.manage(win);

	return win;
};

// Launch new game window
createNew.addEventListener('click', async () => {
	gameRecordWindow = await createGameRecordWindow();
});

// Load Game Selector
const games = JSON.parse(window.localStorage.getItem('game-list'));
const sortedGames = _.sortBy(games, 'game_title');
const groupedGames = _.groupBy(sortedGames, 'platform');

_.each(groupedGames, (value, key) => {
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
	collapse_region.id = 'collapse' + key.replace(/ /g, '');
	collapse_region.setAttribute('aria-labelledby', 'heading' + key.replace(/ |:/gi, ''));
	collapse_region.dataset.parent = '#accordion';

	const card_body = document.createElement('div');
	card_body.classList.add('card-body');
	card_body.classList.add('p-2');

	const game_table = document.createElement('table');
	game_table.classList.add('table');
	game_table.classList.add('table-sm');
	game_table.classList.add('table-hover');

	// Table Header Begin
	const table_head = document.createElement('thead');
	const table_row = document.createElement('tr');

	const col_num = document.createElement('th');
	col_num.scope = 'col';
	col_num.classList.add('w-10');
	col_num.textContent = '#';
	table_row.append(col_num);

	const col_name = document.createElement('th');
	col_name.scope = 'col';
	col_name.classList.add('w-50');
	col_name.textContent = 'Name';
	table_row.append(col_name);

	const col_genre = document.createElement('th');
	col_genre.scope = 'col';
	col_genre.textContent = 'Genre';
	col_genre.classList.add('w-15');
	table_row.append(col_genre);

	const col_year = document.createElement('th');
	col_year.scope = 'col';
	col_year.textContent = 'Year';
	col_year.classList.add('w-15');
	table_row.append(col_year);

	const col_menu = document.createElement('th');
	col_menu.scope = 'col';
	table_row.append(col_menu);

	table_head.append(table_row);
	game_table.append(table_head);
	// Table Header Eend

	// Table Body Begin
	const table_body = document.createElement('tbody');

	// Table Row Loop Being
	value.forEach((game, index) => {
		const game_item = document.createElement('tr');
		const row_num = document.createElement('th');
		const row_name = document.createElement('td');
		const row_genre = document.createElement('td');
		const row_year = document.createElement('td');
		const row_dd = document.createElement('td');

		row_num.scope = 'row';
		row_num.textContent = index + 1;
		row_num.classList.add('align-middle');
		game_item.append(row_num);

		row_name.textContent = game.game_title;
		row_name.classList.add('align-middle');
		row_name.classList.add('text-truncate');
		game_item.append(row_name);

		row_genre.textContent = game.genre;
		row_genre.classList.add('align-middle');
		row_genre.classList.add('text-truncate');
		game_item.append(row_genre);

		row_year.textContent = game.release_year;
		row_year.classList.add('align-middle');
		game_item.append(row_year);

		game_item.dataset.game_id = game.game_id;
		game_item.dataset.title = game.game_title;
		game_item.dataset.platform = game.platform;
		game_item.dataset.genre = game.genre;
		game_item.dataset.release_year = game.release_year;
		game_item.dataset.developer = game.developer;
		game_item.dataset.publisher = game.publisher;
		game_item.dataset.franchise = game.franchise;
		game_item.dataset.series = game.series;
		game_item.dataset.game_note = game.game_note;

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
			gameRecordWindow = await createGameRecordWindow(game_item.dataset);
		});

		const del = document.createElement('a');
		del.classList.add('dropdown-item');
		del.href = '#';
		del.textContent = 'Delete';
		del.addEventListener('click', () => {
			console.log('Deleted');
		});

		row_dd.append(ddButton);
		ddItems.append(edit);
		ddItems.append(del);
		row_dd.append(ddItems);

		game_item.append(row_dd);

		table_body.append(game_item);
	});
	// Table Row Loop End

	game_table.append(table_body);
	// Table Body End

	card_body.append(game_table);

	card_header_h5.append(card_header_btn);
	card_header_div.append(card_header_h5);
	card.append(card_header_div);

	collapse_region.append(card_body);
	card.append(collapse_region);

	gameList.append(card);
});

ipcRenderer.on('reloadWindowFlag', () => {
	gameRecordWindow.reload();
	require('electron').remote.getCurrentWindow().reload();
});
