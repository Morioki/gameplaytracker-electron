const {DateTime} = require('luxon');

function Stopwatch(display, results) {
	// Properties
	this.running = false;
	this.display = display;
	this.results = results;
	this.laps = [];

	this.times = [0, 0, 0, 0];

	// Methods
	this.reset = () => {
		this.times = [0, 0, 0, 0];
		this.startDate = null;
	};

	this.start = () => {
		if (!this.time) {
			this.time = performance.now();
		}

		if (!this.startDate) {
			this.startDate = DateTime.local();
		}

		if (!this.running) {
			this.running = true;
			requestAnimationFrame(this.step.bind(this));
		}
	};

	this.stop = () => {
		this.running = false;
		this.time = null;
	};

	this.clear = () => {
		clearChildren(this.results);
		if (this.running) {
			this.stop();
		}

		this.reset();
		this.print();
	};

	this.step = timestamp => {
		if (!this.running) {
			return;
		}

		this.calculate(timestamp);
		this.time = timestamp;
		this.print();
		requestAnimationFrame(this.step.bind(this));
	};

	this.calculate = timestamp => {
		if (!this.time) {
			return;
		}

		const diff = timestamp - this.time;

		this.times[3] += diff / 10;

		if (this.times[3] >= 100) {
			this.times[2] += 1;
			this.times[3] -= 100;
		}

		if (this.times[2] >= 60) {
			this.times[1] += 1;
			this.times[2] -= 60;
		}

		if (this.times[1] >= 60) {
			this.times[0] += 1;
			this.times[1] -= 60;
		}
	};

	this.print = () => {
		this.display.textContent = this.format(this.times);
	};

	this.format = times => {
		return `\
			${pad0(times[0], 2)}:\
			${pad0(times[1], 2)}:\
			${pad0(times[2], 2)}.\
			${pad0(Math.floor(times[3]), 2)}`;
	};

	this.calcEndDate = () => {
		const hour = this.times[0];
		const min = this.times[1];
		const sec = this.times[2];
		const milli = this.times[3];

		/// const runningTime =	(((((hour * 60) + min) * 60) + sec) * 1000) + milli;

		return this.startDate.plus({hours: hour, minutes: min, seconds: sec, milliseconds: milli});
	};

	this.print();
}

function pad0(value, count) {
	let result = value.toString();

	for (; result.length < count; --count) {
		result = '0' + result;
	}

	return result;
}

function clearChildren(node) {
	while (node.lastChild) {
		node.removeChild(node.lastChild);
	}
}

module.exports = Stopwatch;
