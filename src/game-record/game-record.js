const stubData = require('../stub-data');

// DOM Elements
const gameId = document.querySelector('#game-id-value');
const gameTitle = document.querySelector('#game-title-value');
const gameReleaseYear = document.querySelector('#game-release-year-value');
const gamePlatform = document.querySelector('#game-platform-value');
const gameGenre = document.querySelector('#game-genre-value');
const gameDeveloper = document.querySelector('#game-developer-value');
const gamePublisher = document.querySelector('#game-publisher-value');
const gameFranchise = document.querySelector('#game-franchise-value');
const gameSeries = document.querySelector('#game-series-value');
const gameNote = document.querySelector('#game-note-value');
const gameSafe = document.querySelector('#game-save');

gameSafe.addEventListener('click', e => {
	const gameRecord = {
		gameId: gameId.textContent,
		gameTitle: gameTitle.value,
		gameReleaseYear: gameReleaseYear.value,
		gamePlatform: gamePlatform.value,
		gameGenre: gameGenre.value,
		gameDeveloper: gameDeveloper.value,
		gamePublisher: gamePublisher.value,
		gameFranchise: gameFranchise.value,
		gameSeries: gameSeries.value,
		gameNote: gameNote.value
	}
	console.log(gameRecord);
	console.log('Data Saved');

	console.log(e);
})

console.log('Game Record Loaded');
