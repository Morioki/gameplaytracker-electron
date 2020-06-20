'use strict';
const {ipcRenderer} = require('electron');
const _ = require('lodash');

const PlaySession = require('../classes/playsession');

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
);

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
	if (ps.sw.running) {
		return;
	}

	if (ps.getSelectedGame() === 0) {
		return;
	}

	recordSave.disabled = true;

	await ps.saveSession();

	setTimeout(() => {
		const winId = require('electron').remote.getCurrentWindow().getParentWindow().webContents.id;
		ipcRenderer.sendTo(winId, 'reloadWindowFlagSession', true);
		require('electron').remote.getCurrentWindow().close();
	}, 2000);
});
