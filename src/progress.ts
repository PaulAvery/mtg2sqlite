import { EventEmitter } from 'events';

export type prog = { name: string, progress: number, children: prog[] };

/**
 * A class to track progress of, well, "things".
 * You pass it a name and a promise returning function (e.g. an async function).
 * This function will be called with "this" set to the Progress instance and should
 * attach any parts of the job which should be tracked.
 *
 * The object emits the "success" event once all parts completed, successful or not.
 * The "error" event is emitted for any failed part (including nested ones).
 * The "failure" event is emitted if a job marked as nonexpendable fails.
 */
export default class Progress extends EventEmitter {
	private jobs: { done: boolean, progress: Progress }[] = [];

	/** Flags to only emit success and failure events once */
	private failed = false;
	private running = true;

	/** Number of reserved jobs */
	private reserved = 0;

	/** Flag to signal if the initialization promise funished */
	private initialized = false;

	/** If we failed, the reason for our failure */
	private failureReason: Error | null = null;

	constructor(private name: string, fn: (this: Progress, progress: Progress) => Promise<void>) {
		super();

		fn.call(this, this).then(() => {
			this.initialized = true;

			if(this.reserved > 0) {
				throw new Error('After initialization the amount of reserved jobs was not met by the attached jobs');
			}

			this.check();
		}).catch((e: Error) => {
			this.fatal(e);
		});
	}

	/** Mark this progress object as failed */
	private fatal(error: Error) {
		error.message = `[${this.name}] ${error.message}`;

		if(!this.failed) {
			this.failed = true;
			this.failureReason = error;

			this.emit('failure', this.failureReason);
		}
	}

	/** Check if we are done and if so, emit event */
	private check() {
		if(this.initialized && !this.failed && this.running) {
			if(this.reserved === 0 && this.jobs.filter(j => !j.done).length === 0) {
				this.running = false;
				this.emit('progress');
				this.emit('success');
			}
		}
	}

	/**
	 * Reserve the given number jobs for later attachment.
	 * Useful if you know the number of jobs that will be run but want to execute them one-by-one.
	 */
	public reserve(count: number) {
		if(this.initialized) {
			throw new Error('Tried to reserve jobs on initialized Progress object');
		}

		this.reserved += count;
	}

	/**
	 * Add a new child job to this progress counter.
	 * The child can be a promise or another progress object.
	 * Its progress will factor into the total progress of this object.
	 *
	 * If you previously reserved this slot, pass the "reserved" option,
	 * if this entire progress object should fail based on the result of this job, pass the fatal option.
	 */
	public attach(progress: Progress, { reserved = false, fatal = false } = {}) {
		if(this.initialized) {
			throw new Error('Tried to attach a job on initialized progress object');
		}

		if(reserved) {
			if(this.reserved <= 0) {
				throw new Error('Tried to attach a reserved job with no reserved slots remaining');
			}

			this.reserved--;
		}

		let job = {
			done: false,
			progress: progress
		};

		/* Pass errors on upwards */
		progress.on('error', (e: Error) => {
			e.message = `[${this.name}]${e.message}`;
			this.emit('error', e);
		});

		/* Handle success*/
		progress.on('success', () => {
			job.done = true;
			this.emit('progress');
			this.check();
		});

		/* Handle error */
		progress.on('failure', (e: Error) => {
			job.done = true;
			this.emit('progress');

			e.message = `[${this.name}]${e.message}`;
			this.emit('error', e);

			if(fatal) {
				this.fatal(new Error(`Child failed: ${ e.message }`));
			}

			this.check();
		});

		/* Pass progress upwards */
		progress.on('progress', () => this.emit('progress'));

		this.jobs.push(job);
	}

	/** Returns a progress object for all descendant progress */
	public progress() {
		let progress = 0;
		let children: prog[] = this.jobs.map(j => j.progress.progress());

		let total = this.reserved + this.jobs.length;

		if(total === 0) {
			if(this.initialized) {
				progress = 1;
			}
		} else {
			let childProgress = this.jobs.reduce((sum, job) => sum + job.progress.progress().progress, 0);
			progress = childProgress / total;
		}

		return { name: this.name, progress, children };
	}

	/** Utility method to create a promise which resolves / rejects on failure/success event of this object */
	public toPromise() {
		return new Promise<void>((resolve, reject) => {
			if(this.failed) {
				reject(this.failureReason);
			} else if(!this.running) {
				resolve();
			} else {
				this.on('failure', reject);
				this.on('success', resolve);
			}
		});
	}

	/** Utility method to create a Progress object from a promise */
	public static fromPromise(name: string, promise: Promise<void>) {
		return new Progress(name, () => promise);
	}
}