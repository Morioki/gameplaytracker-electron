'use strict';
const {ipcRenderer} = require('electron');

const stubData = require('../stub-data');
const Stopwatch = require('../stopwatch/stopwatch');
const dbConn = require('../db/db-connection');

// DOM Elemenets
const gameSelector = document.querySelector('#game-selector');
const swStart = document.querySelector('#sw-start');
const swStop = document.querySelector('#sw-stop');
const swClear = document.querySelector('#sw-clear');
const recordSave = document.querySelector('#record-save');

// Load Game Selector
const games = JSON.parse(window.localStorage.getItem('game-list'));

games.forEach(game => {
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

	gameSelector.append(optionEl);
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
	sw.clear()
});

// Save Handler
recordSave.addEventListener('click', async e => {
	if (sw.running) return;

	const playSession = {
		game_id: gameSelector[gameSelector.selectedIndex].value,
		user: 1,
		start_date: new Date(sw.startDate).toISOString().slice(0,19).replace('T', ' '),
		end_date: new Date(sw.calcEndDate()).toISOString().slice(0,19).replace('T', ' ')
	}

	await dbConn.savePlaySession(playSession);
	await dbConn.loadAllData();

	const winId = require('electron').remote.getCurrentWindow().getParentWindow().webContents.id;
	ipcRenderer.sendTo(winId, 'reloadWindowFlagSession', true);

	require('electron').remote.getCurrentWindow().close();
});

console.log('Play Session Loaded');

