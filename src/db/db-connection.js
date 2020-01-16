'use strict';
const mongoose = require('mongoose');
const Store = require('electron-store');

const Game = require('./models/game-model');
const User = require('./models/user-model');
const GameTime = require('./models/gametime-model');

const store = new Store();

const mongoHost = store.get('databases.mongodb.host');
const mongoPort = store.get('databases.mongodb.port');
const mongoUsername = store.get('databases.mongodb.username');
const mongoPass = store.get('databases.mongodb.password');
const mongoAuthSrc = store.get('databases.mongodb.authentication_source');
const mongoURI = `mongodb://${mongoUsername}:${mongoPass}@${mongoHost}:${mongoPort}/gameplay_tracker_electron?authSource=${mongoAuthSrc}`

mongoose.connect(mongoURI, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true});

const getGameRecord = async (gameId) => {
	const gameRecord = await Game.findOne({game_id: gameId}).exec();
	return gameRecord._id
};

const getUserRecord = async (userId) => {
	const userRecord = await User.findOne({user_id: userId}).exec();
	return userRecord._id
};

const loadAllGames = async () => {
	Game.find({}).lean().exec( (err, res) => {
		if (!err) {
			window.localStorage.setItem('game-list', JSON.stringify(res));
		}
	});
};

const loadAllPlaySessions = async () => {
	GameTime.find({}).lean().populate('game_id').exec( (err, res) => {
		if (!err) {
			window.localStorage.setItem('play-session-list', JSON.stringify(res));
		}
	});
};

const saveGameRecord = async (game) => {
	const gameFilter = {
		game_id: game.game_id
	};
	const gameRecord = {
		game_title: game.game_title,
		release_year: game.release_year,
		platform: game.platform,
		genre: game.genre,
		developer: game.developer,
		publisher: game.publisher,
		franchise: game.franchise,
		series: game.series,
		game_note: game.game_note
	};

	if (game.game_id === 'N/A') {
		await Game(gameRecord).save();
	} else {
		await Game.findOneAndUpdate(gameFilter, gameRecord);
	}
};

const savePlaySession = async (session) => {
	const user_id = await getUserRecord(1);
	const game_id = await getGameRecord(session.game_id);

	const sessionFilter = {
		play_session_id: session.play_session_id
	};
	const playSession = {
		game_id: game_id,
		user: user_id,
		start_date: session.start_date,
		end_date: session.end_date
	};

	if (typeof session.play_session_id === 'undefined'){
		await GameTime(playSession).save();
	} else {
		await GameTime.findOneAndUpdate(sessionFilter, playSession);
	}
};

const deleteGameData = async (game) => {
	const gameFilter = {
		game_id: game.game_id
	};
	await Game.findOneAndDelete(gameFilter);
};

const deletePlaySession = async (playSession) => {
	const sessionFilter = {
		play_session_id: session.play_session_id
	};
	await GameTime.findOneAndDelete(sessionFilter);
}

const loadAllData = async () => {
	window.localStorage.clear();
	loadAllGames();
	loadAllPlaySessions();
};



module.exports.loadAllGames = loadAllGames;
module.exports.loadAllPlaySessions = loadAllPlaySessions;
module.exports.saveGameRecord = saveGameRecord;
module.exports.savePlaySession = savePlaySession;
module.exports.deleteGameData = deleteGameData;
module.exports.deletePlaySession = deletePlaySession;
module.exports.loadAllData = loadAllData;
