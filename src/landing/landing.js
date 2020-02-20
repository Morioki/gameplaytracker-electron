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

		topGames.forEach(game => {
			const gameItem = document.createElement('div');
			const nameSpan = document.createElement('span');
			const yearSpan = document.createElement('span');
			const hourSpan = document.createElement('span');

			gameItem.classList.add('row');
			gameItem.classList.add('p-1');

			nameSpan.classList.add('col-6');
			nameSpan.classList.add('align-middle');

			yearSpan.classList.add('col-3');
			yearSpan.classList.add('align-middle');

			hourSpan.classList.add('col-3');
			hourSpan.classList.add('align-middle');

			nameSpan.textContent = game.game_title;
			yearSpan.textContent = game.release_year;
			hourSpan.textContent = game.hours.toFixed(2);

			gameItem.append(nameSpan);
			gameItem.append(yearSpan);
			gameItem.append(hourSpan);

			topGamesDOM.append(gameItem);
		});
	}, 300);
})();

// Trash statement to prevent error
if (typeof activeWindow !== 'undefined') {
	activeWindow.reload();
}
