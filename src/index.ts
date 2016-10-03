require('longjohn');

const parse = require('./lib/import');
const database = require('./lib/database');
const readline = require('readline');

let progress = parse();

let interval = setInterval(() => {
	readline.cursorTo(process.stdout, 0, 0);
	readline.clearScreenDown(process.stdout);

	function printProgress(p) {
		console.log(`${p.name}: ${(p.progress() * 100).toFixed(2)}% [${p.completed} / ${p.total}]`);

		if(p.working.length) {
			printProgress(p.working[0]);
		}
	}

	printProgress(progress);
}, 1000);

/* TODO */
clearInterval(interval);

progress.then(() => {
	clearInterval(interval);

	return database.then(db => db('errors').select());
})
.then(errors => {
	if(errors.length > 0) {
		console.log('The following errors occcured:');
		errors.forEach(e => console.log(`${e.type}: ${e.message}`));
	}

	return database.then(db => db.destroy());
})
.catch(e => console.error(e) || process.exit(1));
