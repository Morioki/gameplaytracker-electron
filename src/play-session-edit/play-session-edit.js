const {ipcRenderer} = require('electron');

const dbConn = require('../db/db-connection');

// DOM Elements
const gameSelector = document.querySelector('#game-selector');
const sessionNote = document.querySelector('#session-note-value');
const recordSave = document.querySelector('#record-save');

const games = JSON.parse(window.localStorage.getItem('game-list'));

let activeID;

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

ipcRenderer.on('dataForSessionEdit', (e, args) => {
	gameSelector.value = args.game_id;
	sessionNote.value = args.note;
	activeID = args.session_id;
});

// Save Handler
recordSave.addEventListener('click', async () => {
	const playSession = {
		play_session_id: activeID,
		game_id: gameSelector[gameSelector.selectedIndex].value,
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