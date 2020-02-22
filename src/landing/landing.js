'use strict';
const {BrowserWindow} = require('electron').remote;
const Mousetrap = require('mousetrap');
const {DateTime} = require('luxon');
const windowStateKeeper = require('electron-window-state');

const dbConn = require('../db/db-connection');

// DOM Nodes
const topGamesDOM = document.querySelector('#topGames');

let activeWindow;

// Konami code!
Mousetrap.bind('up up down down left right left right b a enter', () => {
	console.log('konami code');
});

const createGameListWindow = async () => {
	const state = windowStateKeeper({
		defaultWidth: 600, defaultHeight: 800
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
		maxWidth: 2000,
		maxHeight: 2000,
		backgroundColor: '#DEDEDE',
		webPreferences: {nodeIntegration: true}
	});

	win.once('ready-to-show', () => {
		win.show();
	});

	win.once('closed', () => {
		activeWindow = undefined;
	});

	await win.loadFile('./src/game-list/game-list.html');

	state.manage(win);

	return win;
};

const createPlaySessionListWindow = async () => {
	const state = windowStateKeeper({
		defaultWidth: 600, defaultHeight: 800
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
		maxWidth: 2000,
		maxHeight: 2000,
		backgroundColor: '#DEDEDE',
		webPreferences: {nodeIntegration: true}
	});

	win.once('ready-to-show', () => {
		win.show();
	});

	win.once('closed', () => {
		activeWindow = undefined;
	});

	await win.loadFile('./src/play-session-list/play-session-list.html');

	state.manage(win);

	return win;
};

Mousetrap.bind('g', async () => {
	activeWindow = await createGameListWindow();

	return false;
});

Mousetrap.bind('p', async () => {
	activeWindow = await createPlaySessionListWindow();

	return false;
});

(async () => {
	// Load Session Data for all windows
	await dbConn.loadAllData();

	// ? Has to wait 300 milliseconds at least for some reason
	setTimeout(() => {
		const playSessions = JSON.parse(window.localStorage.getItem('play-session-list'));
		const result = [];
		playSessions.reduce((res, sesh) => {
			const startDate = DateTime.fromISO(sesh.start_date);
			const endDate = DateTime.fromISO(sesh.end_date);
			const hours = (Math.abs(((startDate - endDate) / 3.6e6) * 100) + Number.EPSILON) / 100;
			if (!res[sesh.game_id.game_title]) {
				res[sesh.game_id.game_title] = {
					game_title: sesh.game_id.game_title,
					release_year: sesh.game_id.release_year,
					hours: 0
				};
				result.push(res[sesh.game_id.game_title]);
			}

			res[sesh.game_id.game_title].hours += hours;
			return res;
		}, {});

		result.sort((a, b) => (a.hours < b.hours) ? 1 : -1);

		const topGames = result.splice(0, 11);

		const game_table = document.createElement('table');
		game_table.classList.add('table');
		game_table.classList.add('table-sm');
		game_table.classList.add('table-hover');

		// Table Header Begin
		const table_head = document.createElement('thead');

		const agg_row = document.createElement('tr');
		const agg_col = document.createElement('th');
		agg_col.colSpan	= 2;
		agg_col.scope = 'col';
		agg_col.textContent = 'Aggregate: By Game';
		agg_col.classList.add('align-middle');
		agg_row.append(agg_col);
		table_head.append(agg_row);

		const game_col = document.createElement('th');
		const game_button = document.createElement('button');
		agg_col.scope = 'col';
		game_button.classList.add('btn');
		game_button.classList.add('btn-sm');
		game_button.classList.add('btn-secondary');
		game_button.type = 'button';
		game_button.textContent = 'Games';
		game_button.addEventListener('click', async () => {
			activeWindow = await createGameListWindow();
		});
		game_col.append(game_button);
		agg_row.append(game_col);

		const sesh_col = document.createElement('th');
		const sesh_button = document.createElement('button');
		agg_col.scope = 'col';
		sesh_button.classList.add('btn');
		sesh_button.classList.add('btn-sm');
		sesh_button.classList.add('btn-secondary');
		sesh_button.type = 'button';
		sesh_button.textContent = 'Sessions';
		sesh_button.addEventListener('click', async () => {
			activeWindow = await createPlaySessionListWindow();
		});
		sesh_col.append(sesh_button);
		agg_row.append(sesh_col);

		table_head.append(agg_row);

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

		const col_year = document.createElement('th');
		col_year.scope = 'col';
		col_year.textContent = 'Year';
		col_year.classList.add('w-15');
		table_row.append(col_year);

		const col_hoursPlayed = document.createElement('th');
		col_hoursPlayed.scope = 'col';
		col_hoursPlayed.textContent = 'Tot. Hours';
		col_hoursPlayed.classList.add('w-15');
		table_row.append(col_hoursPlayed);

		table_head.append(table_row);
		game_table.append(table_head);
		// Table Header Eend

		// Table Body Begin
		const table_body = document.createElement('tbody');

		// Table Row Loop Being
		topGames.forEach((game, index) => {
			const game_item = document.createElement('tr');
			const row_num = document.createElement('th');
			const row_name = document.createElement('td');
			const row_year = document.createElement('td');
			const row_hours = document.createElement('td');

			row_num.scope = 'row';
			row_num.textContent = index + 1;
			row_num.classList.add('align-middle');
			game_item.append(row_num);

			row_name.textContent = game.game_title;
			row_name.classList.add('align-middle');
			row_name.classList.add('text-truncate');
			game_item.append(row_name);

			row_year.textContent = game.release_year;
			row_year.classList.add('align-middle');
			game_item.append(row_year);

			row_hours.textContent = game.hours.toFixed(2);
			row_hours.classList.add('align-middle');
			game_item.append(row_hours);

			table_body.append(game_item);
		});
		// Table Row Loop End

		game_table.append(table_body);
		// Table Body End

		topGamesDOM.append(game_table);
	}, 300);
})();

// Trash statement to prevent error
if (typeof activeWindow !== 'undefined') {
	activeWindow.reload();
}
