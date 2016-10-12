import 'longjohn';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

import parse from './import';
import database from './database';

import { QueryError } from './database/Queryable';

/* Create error log */
let log = fs.createWriteStream(path.join(process.cwd(), 'mtg2sqlite.log'));
log.on('error', (e: Error) => console.error(e) || process.exit(1));

async function main() {
	let db = await database;
	let progress = parse();

	/* Log errors */
	progress.on('error', (e: Error) => console.log(e));

	/* Output current progress to stdout */
	progress.on('progress', () => {
		//readline.cursorTo(process.stdout, 0, 0);
		//readline.clearScreenDown(process.stdout);

		//console.log(JSON.stringify(progress.progress(), null, 2));
	});

	await progress.toPromise();
	await db.close();
}

main().then(() => log.close()).catch(e => console.error(e) || process.exit(1));
