function Stopwatch(display, results) {
    
    // Properties
    this.running = false;
    this.display = display;
    this.results = results;
    this.laps = [];

    this.times = [0, 0, 0];

    // Methods
    this.reset = () => {
        this.times = [0, 0, 0];
    }

    this.start = () => {
        if(!this.time) this.time = performance.now();
        if(!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this))
        }
    }

    this.lap = () => {
        let times = this.times;
        let li = document.createElement('li');
        li.innerText = this.format(times);
        this.results.appendChild(li);
    }

    this.stop = () => {
        this.running = false;
        this.time = null;
    }

    this.clear = () => {
        clearChildren(this.result);
    }

    this.step = timestamp => {
        if(!this.running) return;
        this.calculate(timestamp);
        this.time = timestamp;
        this.print();
        requestAnimationFrame(this.step.bind(this));
    }

    this.calculate = timestamp => {
        var diff = timestamp - this.time;

        this.times[2] += diff / 10;

        if (this.times[2] >= 100) {
            this.times[1] += 1;
            this.times[2] -= 100;
        }

        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60
        }
    }

    
}