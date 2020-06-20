'use strict';
const dbConn = require('../db/db-connection');
const Stopwatch = require('./stopwatch');

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

	async saveSession() {
		// Variables
		let finalmilliseconds = 0;
		let finalseconds = 0;
		let finalminutes = 0;
		let finalhours = 0;

		let carryseconds = 0;
		let carryminutes = 0;
		let carryhours = 0;

		// Append millisecond mod to milliseconds
		finalmilliseconds = Math.floor(this.millisecondModifier + Number(this.sw.getSWData()['milliseconds']));
		carryseconds = Math.floor(finalmilliseconds / 1000);
		finalmilliseconds %= 1000;

		// Append seconds mod and carry over to seconds
		finalseconds = Math.floor(this.secondModifier + carryseconds + Number(this.sw.getSWData()['seconds']));
		carryminutes = Math.floor(finalseconds / 60);
		finalseconds %= 60;

		// Append minutes mod and carry over into minutes
		finalminutes = Math.floor(this.minuteModifier + carryminutes + Number(this.sw.getSWData()['minutes']));
		carryhours = Math.floor(finalminutes / 60);
		finalminutes %= 60;

		// Append hour mod and hour carryover
		finalhours = Math.floor(this.hourModifier + carryhours + Number(this.sw.getSWData()['hours']));

		// Save Record
		this.sw.setSWTime(finalhours, finalminutes, finalseconds, finalmilliseconds);
		
		await dbConn.savePlaySession(this);
		await dbConn.loadAllData();

		// Reset Modifiers
		this.setHourModifier(0);
		this.setMinuteModifier(0);
		this.setSecondModifier(0);
		this.setMillisecondModifier(0);
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
