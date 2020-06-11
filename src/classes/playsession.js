'use strict';
const dbConn = require('../db/db-connection');
const Stopwatch = require('./stopwatch');

/// TODO Add save functionality to play session
class PlaySession {
	constructor(swField, SessionId = 0, SelectedGameID = 0, Notes = '', SWTime = [0, 0, 0, 0]) {
		this.sw = new Stopwatch(swField, SWTime);
		this.sessionId = SessionId;
		this.selectedGameId = SelectedGameID;
		this.notes = Notes;

		this.hourModifier = 0;
		this.minuteModifier = 0;
		this.secondModifier = 0;
		this.millisecondModifier = 0;
	}

	async loadExistingSession(SessionToLoadId = 0) {
		if (SessionToLoadId === 0) {
			return;
		}

		const session = await dbConn.getPlaySessionRecord(SessionToLoadId);
		this.sessionId = session.gametime_id;
		this.selectedGameId = session.game_id.game_id;
		this.notes = session.note;
	}

	setSelectedGame(SelectedGameID) {
		this.selectedGameId = SelectedGameID;
	}

	setNotes(Notes) {
		this.notes = Notes;
	}

	setHourModifier(HourModifier) {
		this.hourModifier = HourModifier;
	}

	setMinuteModifier(MinuteModifier) {
		this.minuteModifier = MinuteModifier;
	}

	setSecondModifier(SecondModifier) {
		this.secondModifier = SecondModifier;
	}

	setMillisecondModifier(MillisecondModifier) {
		this.millisecondModifier = MillisecondModifier;
	}

	getSelectedGame() {
		return this.selectedGameId;
	}

	getNotes() {
		return this.notes;
	}

	getHourModifier() {
		return this.hourModifier;
	}

	getMinuteModifier() {
		return this.minuteModifier;
	}

	getSecondModifier() {
		return this.secondModifier;
	}

	getMillisecondModifier() {
		return this.millisecondModifier;
	}
}

module.exports = PlaySession;
