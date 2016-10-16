import * as fs from 'fs';
import * as path from 'path';

import parse from './import';
import database from './database';

import { QueryError } from './database/Queryable';

/* Create error log */
let log = fs.createWriteStream(path.join(process.cwd(), 'mtg2sqlite.log'));
log.on('error', (e: Error) => console.error(e.stack) || process.exit(1));

async function main() {
	let db = await database;
	let progress = parse();

	/* Log errors */
	progress.on('error', (e: Error) => log.write(e.stack + '\n\n'));

	/* Output current progress to stdout */
	progress.on('progress', () => console.log(progress.progress));

	await progress.toPromise();
	await db.close();
}

main().then(() => log.close()).catch(e => console.error(e.stack) || process.exit(1));
