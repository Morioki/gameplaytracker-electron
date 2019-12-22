const stubData = require('../stub-data');
const stopwatch = require('../stopwatch/stopwatch')

// DOM Elemenets
const gameSelector = document.querySelector('#game-selector');
const swStart = document.querySelector('#sw-start');
const swStop = document.querySelector('#sw-stop');
const swClear = document.querySelector('#sw-clear');
const recordSave = document.querySelector('#record-save')

// Load Game Selector
const games = stubData.gameList;

games.forEach(game => {
	const optionEl = document.createElement('option');
	optionEl.textContent = game.gameTitle;
	optionEl.value = game.gameId;

	// Load data elements
	optionEl.dataset.platform = game.platform;
	optionEl.dataset.genre = game.genre;
	optionEl.dataset.releaseYear = game.releaseYear;
	optionEl.dataset.developer = game.developer;
	optionEl.dataset.publisher = game.publisher;
	optionEl.dataset.franchise = game.franchise;
	optionEl.dataset.series = game.series;
	optionEl.dataset.gameNote = game.gameNote;

	gameSelector.append(optionEl);
});

// Build Stopwatch
let sw = new stopwatch(
	document.querySelector('.stopwatch'),
	document.querySelector('.results')
);

swStart.addEventListener('click', sw.start);
swStop.addEventListener('click', sw.stop);
swClear.addEventListener('click', sw.clear)

// Save Handler
recordSave.addEventListener('click', e => {
	console.log(gameSelector.options[gameSelector.selectedIndex].value);
	console.log(gameSelector.options[gameSelector.selectedIndex].dataset.franchise);
})

console.log('Play Session Loaded');

