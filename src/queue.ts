type Queueable = {
	run: () => void,
	locking: boolean
};

export default function queue() {
	let id = 0;
	let queue: Queueable[] = [];
	let locked = false;
	let running = 0;

	return (locking = false) => {
		let jid = ++id;

		let promise = new Promise<() => void>(res => {
			/* This function will run the job */
			let run = () => {
				running++;

				if(locking) {
					locked = true;
				}

				/* We resolve the promise with an unlock function which can be called */
				res(() => {
					running--;

					if(locking) {
						locked = false;

						/* Start all queued jobs up until the first locking one */
						while(queue.length && !locked) {
							if(!queue[0].locking) {
								let entry = queue.shift();

								/*
								 * Technically this cannot be undefined but TS cannot infer that.
								 * Therefore we have to handle the case of shift() returning undefined.
								 */
								if(entry) {
									entry.run();
								}
							} else {
								if(running) {
									/* We are running something and the next one will lock so wait */
									break;
								} else {
									let entry = queue.shift();

									/*
									* Technically this cannot be undefined but TS cannot infer that.
									* Therefore we have to handle the case of shift() returning undefined.
									*/
									if(entry) {
										entry.run();
									}
								}
							}
						}
					} else if(running === 0) {
						/* We have no running jobs, so run the next one if available */
						let entry = queue.shift();

						if(entry) {
							entry.run();
						}
					}
				});
			};

			if(locking) {
				if(running > 0) {
					/* We need to wait for all running jobs to finish */
					queue.push({ locking, run });
				} else {
					run();
				}
			} else {
				if(queue.length > 0 || locked) {
					/* We have a locking job somewhere in in the queue or running, so queue this */
					queue.push({ locking, run });
				} else {
					run();
				}
			}
		});

		return promise;
	}
}