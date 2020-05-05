const {DateTime} = require('luxon');

class Stopwatch {
	constructor(display) {
		this.running = false;
		this.display = display;
		this.laps = [];
		this.times = [0, 0, 0, 0];

		this.print();
	}

	// Methods
	reset() {
		this.times = [0, 0, 0, 0];
		this.startDate = null;
	}

	start() {
		if (this.running) {
			return;
		}

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
	}

	stop() {
		this.running = false;
		this.time = null;
	}

	clear() {
		/// clearChildren(this.results);

		if (this.running) {
			this.stop();
		}

		this.reset();
		this.print();
	}

	step(timestamp) {
		if (!this.running) {
			return;
		}

		this.calculate(timestamp);

		this.time = timestamp;
		this.print();
		requestAnimationFrame(this.step.bind(this));
	}

	calculate(timestamp) {
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
	}

	print() {
		this.display.textContent = this.format(this.times);
	}

	format(times) {
		return `\
			${pad0(times[0], 2)}:\
			${pad0(times[1], 2)}:\
			${pad0(times[2], 2)}.\
			${pad0(Math.floor(times[3]), 2)}`;
	}

	calcEndDate() {
		const hour = this.times[0];
		const min = this.times[1];
		const sec = this.times[2];
		const milli = this.times[3];

		return this.startDate.plus({hours: hour, minutes: min, seconds: sec, milliseconds: milli});
	}
}

function pad0(value, count) {
	let result = value.toString();

	for (; result.length < count; --count) {
		result = '0' + result;
	}

	return result;
}

module.exports = Stopwatch;
