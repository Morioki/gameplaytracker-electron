'use strict';
const {DateTime} = require('luxon');

const stubData = require('../stub-data');
const Stopwatch = require('../stopwatch/stopwatch');

// DOM Elemenets
const gameSelector = document.querySelector('#game-selector');
const swStart = document.querySelector('#sw-start');
const swStop = document.querySelector('#sw-stop');
const swClear = document.querySelector('#sw-clear');
const recordSave = document.querySelector('#record-save');

// Load Game Selector
const games = stubData.gameList;

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
	const startDate = new Date().toISOString().slice(0,19).replace('T', ' ');	
	sw.start();
	console.log(startDate);
});

swStop.addEventListener('click', () => {
	sw.stop();
});

swClear.addEventListener('click', sw.clear);

// Save Handler
recordSave.addEventListener('click', e => {
	console.log(sw.dumpTime(sw.times))
	console.log(e);
});

console.log('Play Session Loaded');

