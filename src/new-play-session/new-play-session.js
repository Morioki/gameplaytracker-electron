'use strict';
const {ipcRenderer} = require('electron');
const _ = require('lodash');

const Stopwatch = require('../classes/stopwatch');
const dbConn = require('../db/db-connection');
const PlaySession = require('../classes/playsession');

/// TODO Rebuild in same manner as edit page
// DOM Elemenets
const gameSelector = document.querySelector('#game-selector');
const swStart = document.querySelector('#sw-start');
const swStop = document.querySelector('#sw-stop');
const swClear = document.querySelector('#sw-clear');
const sessionNote = document.querySelector('#session-note-value');
const hourMod = document.querySelector('#hour-mod-value');
const minuteMod = document.querySelector('#minute-mod-value');
const secondMod = document.querySelector('#second-mod-value');
const milliMod = document.querySelector('#milli-mod-value');
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

// Build Play Session Object
const ps = new PlaySession(
	document.querySelector('.stopwatch')	
)

swStart.addEventListener('click', () => {
	ps.sw.start();
});

swStop.addEventListener('click', () => {
	ps.sw.stop();
});

swClear.addEventListener('click', () => {
	ps.sw.clear();
});

gameSelector.addEventListener('change', () => {
	ps.setSelectedGame(gameSelector.value);
});

sessionNote.addEventListener('keyup', () => {
	ps.setNotes(sessionNote.value);
});

hourMod.addEventListener('change', () => {
	ps.setHourModifier(Number(hourMod.value));
});

minuteMod.addEventListener('change', () => {
	ps.setMinuteModifier(Number(minuteMod.value));
});

secondMod.addEventListener('change', () => {
	ps.setSecondModifier(Number(secondMod.value));
});

milliMod.addEventListener('change', () => {
	 ps.setMillisecondModifier(Number(milliMod.value));
});
	
recordSave.addEventListener('click', async () => {
	console.log(ps);
});

// TODO Renable Save Handler
// Save Handler
// recordSave.addEventListener('click', async () => {
// 	if (sw.running) {
// 		return;
// 	}

// 	if (gameSelector[gameSelector.selectedIndex].value === 0) {
// 		return;
// 	}

// 	const playSession = {
// 		game_id: gameSelector[gameSelector.selectedIndex].value,
// 		user: 1,
// 		start_date: sw.startDate.toISO(),
// 		end_date: sw.calcEndDate().toISO(),
// 		note: sessionNote.value
// 	};

// 	await dbConn.savePlaySession(playSession);
// 	await dbConn.loadAllData();

// 	setTimeout(() => {
// 		const winId = require('electron').remote.getCurrentWindow().getParentWindow().webContents.id;
// 		ipcRenderer.sendTo(winId, 'reloadWindowFlagSession', true);
// 		require('electron').remote.getCurrentWindow().close();
// 	}, 2000);
// });
