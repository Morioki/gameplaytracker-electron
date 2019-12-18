module.exports = (display, results) => {
	// Properties
	this.running = false;
	this.display = display;
	this.results = results;
	this.laps = [];

	this.times = [0, 0, 0];

	// Methods
	this.reset = () => {
		this.times = [0, 0, 0];
	};

	this.start = () => {
		if (!this.time) {
			this.time = performance.now();
		}

		if (!this.running) {
			this.running = true;
			requestAnimationFrame(this.step.bind(this));
		}
	};

	this.lap = () => {
		const {times} = this;
		const li = document.createElement('li');
		li.textContent = this.format(times);
		this.results.append(li);
	};

	this.stop = () => {
		this.running = false;
		this.time = null;
	};

	this.clear = () => {
		clearChildren(this.result);
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
		const diff = timestamp - this.time;

		this.times[2] += diff / 10;

		if (this.times[2] >= 100) {
			this.times[1] += 1;
			this.times[2] -= 100;
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
			${pad0(Math.floor(times[2]), 2)}`;
	};
};

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
