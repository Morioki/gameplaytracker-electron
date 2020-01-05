const {ipcRenderer} = require('electron');

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
	};
	console.log(gameRecord);
	console.log('Data Saved');

	console.log(e);
});


ipcRenderer.on('dataForGameRecord', (e, args) => {
	console.log(args);

	gameId.textContent = args.gameId;
	gameTitle.value = args.title;
	gameReleaseYear.value = args.releaseYear;
	gamePlatform.value = args.platform;
	gameGenre.value = args.genre;
	gameDeveloper.value = args.developer;
	gamePublisher.value = args.publisher;
	gameFranchise.value = args.franchise;
	gameSeries.value = args.series;
	gameNote.value = args.gameNote;
	
	console.log('All Data Loaded');
})

console.log('Game Record Loaded');
