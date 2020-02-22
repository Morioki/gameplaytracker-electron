'use strict';
const {ipcRenderer} = require('electron');
const _ = require('lodash');

const Stopwatch = require('../stopwatch/stopwatch');
const dbConn = require('../db/db-connection');

// DOM Elemenets
const gameSelector = document.querySelector('#game-selector');
const swStart = document.querySelector('#sw-start');
const swStop = document.querySelector('#sw-stop');
const swClear = document.querySelector('#sw-clear');
const sessionNote = document.querySelector('#session-note-value');
const recordSave = document.querySelector('#record-save');

// Load Game Selector
const games = JSON.parse(window.localStorage.getItem('game-list'));
const sortedGames = _.sortBy(games, 'game_title');
const groupedGames = _.groupBy(sortedGames, 'platform');

_.each(groupedGames, (value, key) => {
	const optionGroup = document.createElement('optgroup');
	optionGroup.label = key;

	_.each(value, game => {
		const optionEl = document.createElement('option');
		optionEl.textContent = game.game_title;
		optionEl.value = game.game_id;

		// Load data elements
		optionEl.dataset.platform = game.platform;
		optionEl.dataset.genre = game.genre;
		optionEl.dataset.releaseYear = game.release_year;
		optionEl.dataset.developer = game.developer;
		optionEl.dataset.publisher = game.publisher;
		optionEl.dataset.franchise = game.franchise;
		optionEl.dataset.series = game.series;
		optionEl.dataset.gameNote = game.game_note;

		optionGroup.append(optionEl);
	});

	gameSelector.append(optionGroup);
});

// Build Stopwatch
const sw = new Stopwatch(
	document.querySelector('.stopwatch'),
	document.querySelector('.results')
);

swStart.addEventListener('click', () => {
	sw.start();
});

swStop.addEventListener('click', () => {
	sw.stop();
});

swClear.addEventListener('click', () => {
	sw.clear();
});

// Save Handler
recordSave.addEventListener('click', async () => {
	if (sw.running) {
		return;
	}

	if (gameSelector[gameSelector.selectedIndex].value === 0) {
		return;
	}

	const playSession = {
		game_id: gameSelector[gameSelector.selectedIndex].value,
		user: 1,
		start_date: sw.startDate.toISO(),
		end_date: sw.calcEndDate().toISO(),
		note: sessionNote.value
	};

	await dbConn.savePlaySession(playSession);
	await dbConn.loadAllData();

	setTimeout(() => {
		const winId = require('electron').remote.getCurrentWindow().getParentWindow().webContents.id;
		ipcRenderer.sendTo(winId, 'reloadWindowFlagSession', true);
		require('electron').remote.getCurrentWindow().close();
	}, 2000);
});
