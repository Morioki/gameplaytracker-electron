'use strict';
const mongoose = require('mongoose');
const Store = require('electron-store');
const {is} = require('electron-util');

const Game = require('./models/game-model');
const User = require('./models/user-model');
const GameTime = require('./models/gametime-model');

const store = new Store();

let mongoHost;
let mongoPort;
let mongodbName;
let mongoUsername;
let mongoPass;
let mongoAuthSrc;

if (is.development) {
	mongoHost = store.get('databases.dev_mongodb.host');
	mongoPort = store.get('databases.dev_mongodb.port');
	mongodbName = store.get('databases.dev_mongodb.db');
	mongoUsername = store.get('databases.dev_mongodb.username');
	mongoPass = store.get('databases.dev_mongodb.password');
	mongoAuthSrc = store.get('databases.dev_mongodb.authentication_source');
} else {
	mongoHost = store.get('databases.mongodb.host');
	mongoPort = store.get('databases.mongodb.port');
	mongodbName = store.get('databases.mongodb.db');
	mongoUsername = store.get('databases.mongodb.username');
	mongoPass = store.get('databases.mongodb.password');
	mongoAuthSrc = store.get('databases.mongodb.authentication_source');
}

const mongoURI = `mongodb://${mongoUsername}:${mongoPass}@${mongoHost}:${mongoPort}/${mongodbName}?authSource=${mongoAuthSrc}`;
mongoose.connect(mongoURI, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true});

const getPlaySessionRecord = async sessionId => {
	const playSession = await GameTime.findOne({gametime_id: sessionId}).populate('game_id').exec();
	return playSession;
};

const getGameRecord = async gameId => {
	const gameRecord = await Game.findOne({game_id: gameId}).exec();
	return gameRecord._id;
};

const getUserRecord = async userId => {
	const userRecord = await User.findOne({user_id: userId}).exec();
	return userRecord._id;
};

const loadAllGames = async () => {
	Game.find({}).lean().exec((err, res) => {
		if (!err) {
			window.localStorage.setItem('game-list', JSON.stringify(res));
		}
	});
};

const loadAllPlaySessions = async () => {
	GameTime.find({}).lean().populate('game_id').exec((err, res) => {
		if (!err) {
			window.localStorage.setItem('play-session-list', JSON.stringify(res));
		}
	});
};

const saveGameRecord = async game => {
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

const savePlaySession = async session => {
	const user_id = await getUserRecord(1);
	const game_id = await getGameRecord(session.getSelectedGame());

	const sessionFilter = {
		gametime_id: session.sessionId
	};

	console.log(session.sessionId)

	const playSession = {
		game_id,
		user: user_id,
		start_date: session.sw.startDate,
		/// end_date: session.end_date,
		hours: Number(session.sw.getSWData()['hours']),
		minutes: Number(session.sw.getSWData()['minutes']),
		seconds: Number(session.sw.getSWData()['seconds']),
		milliseconds: Number(session.sw.getSWData()['milliseconds']),
		note: session.notes
	};

	if (session.sessionId === 0) {
		await GameTime(playSession).save();
	} else {
		const upPlaySession = {
			game_id,
			hours: Number(session.sw.getSWData()['hours']),
			minutes: Number(session.sw.getSWData()['minutes']),
			seconds: Number(session.sw.getSWData()['seconds']),
			milliseconds: Number(session.sw.getSWData()['milliseconds']),
			note: session.notes
		};

		await GameTime.findOneAndUpdate(sessionFilter, upPlaySession);
	}
};

const deleteGameData = async game => {
	const gameFilter = {
		game_id: game.game_id
	};
	await Game.findOneAndDelete(gameFilter);
};

const deletePlaySession = async session => {
	const sessionFilter = {
		play_session_id: session.play_session_id
	};
	await GameTime.findOneAndDelete(sessionFilter);
};

const loadAllData = async () => {
	window.localStorage.clear();
	await loadAllGames();
	await loadAllPlaySessions();
};

module.exports.getPlaySessionRecord = getPlaySessionRecord;
module.exports.loadAllGames = loadAllGames;
module.exports.loadAllPlaySessions = loadAllPlaySessions;
module.exports.saveGameRecord = saveGameRecord;
module.exports.savePlaySession = savePlaySession;
module.exports.deleteGameData = deleteGameData;
module.exports.deletePlaySession = deletePlaySession;
module.exports.loadAllData = loadAllData;
