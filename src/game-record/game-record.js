'use strict';
const {ipcRenderer} = require('electron');

const dbConn = require('../db/db-connection');

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
const gameSave = document.querySelector('#game-save');

gameSave.addEventListener('click', async () => {
	const gameRecord = {
		game_id: gameId.textContent,
		game_title: gameTitle.value,
		release_year: gameReleaseYear.value,
		platform: gamePlatform.value,
		genre: gameGenre.value,
		developer: gameDeveloper.value,
		publisher: gamePublisher.value,
		franchise: gameFranchise.value,
		series: gameSeries.value,
		game_note: gameNote.value
	};

	await dbConn.saveGameRecord(gameRecord);
	await dbConn.loadAllData();

	setTimeout(() => {
		const winId = require('electron').remote.getCurrentWindow().getParentWindow().webContents.id;
		ipcRenderer.sendTo(winId, 'reloadWindowFlag', true);
		require('electron').remote.getCurrentWindow().close();
	}, 2000);
});

ipcRenderer.on('dataForGameRecord', (e, args) => {
	gameId.textContent = args.game_id;
	gameTitle.value = args.title;
	gameReleaseYear.value = args.release_year;
	gamePlatform.value = args.platform;
	gameGenre.value = args.genre;
	gameDeveloper.value = args.developer;
	gamePublisher.value = args.publisher;
	gameFranchise.value = args.franchise;
	gameSeries.value = args.series;
	gameNote.value = args.game_note;
});
