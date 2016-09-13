const co = require('co');
const database = require('./database');

class Progress extends Promise {
	constructor(fn) {
		let reject;
		let resolve;

		super((res, rej) => {
			reject = rej;
			resolve = res;

			if(typeof fn === 'function') {
				fn(res, rej);
			}
		});

		if(typeof fn === 'string') {
			this.name = fn;
		}

		this.resolve = d => resolve(d);
		this.reject = e => reject(e);

		this.noProgressCompleted = 0;
		this.noProgressTotal = 0;

		this.completed = 0;
		this.working = [];
		this.total = 0;
	}

	addTotal(count) {
		this.total += count;

		return this;
	}

	attach(child, { reserved = false, progress = true } = {}) {
		if(!reserved && progress) {
			this.total++;
		} else if(!progress) {
			this.noProgressTotal++;
		}

		if(child.progress) {
			this.working.push(child);
		}

		child.catch(e => {
			this.reject(e);
		}).then(() => {
			if(progress) {
				this.completed++;
			} else {
				this.noProgressCompleted++;
			}

			if(child.progress) {
				this.working.splice(this.working.indexOf(child), 1);
			}

			if(this.completed === this.total && this.noProgressCompleted === this.noProgressTotal) {
				this.resolve();
			}
		});

		return child;
	}

	progress() {
		let completed = this.completed + this.working.reduce((sum, c) => sum + c.progress(), 0);

		return this.total === 0 ? 0 : completed / this.total;
	}
}

/*
 * Utility method to create a named progress instance
 * which logs its errors to the database.
 */
Progress.make = function(name, fn, fnFatal) {
	let progress = new Progress(name);

	let promise = co(function *() {
		let db = yield database;

		if(fnFatal) {
			/* Woohoo, finally a usage for this */
			[fn, fnFatal] = [fnFatal, fn];

			yield fnFatal.call(progress, db);
		}

		try {
			yield fn.call(progress, db);
		} catch(e) {
			yield db('errors').insert({ message: e.message, stack: e.stack, type: name });
		}
	});

	progress.attach(promise, { progress: false });

	return progress;
};

module.exports = Progress;
