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
	progress.on('progress', () => {
		/* Clear console */
		console.log('\x1B[2J');

		/* Prepare columns of set progress */
		let width = process.stdout.columns;
		let rowCount = process.stdout.rows - 3;
		let columnCount = Math.ceil(progress.progress.children.length / rowCount);
		let columnWidth = Math.floor(width / columnCount) - 1;
		let padding = new Array(columnWidth + 1).join(' ');

		let columns: Array<Array<string>> = [[]];

		for(let child of progress.progress.children) {
			let column = columns[columns.length - 1];

			let rounded = Math.round(child.progress * 100);
			let progress = padding.substr(0, 3 - rounded.toString().length) + rounded;

			column.push(`${progress}% - ${child.name}${padding}`.substr(0, columnWidth));

			if(column.length === rowCount) {
				columns.push([]);
			}
		}

		/* Write the total */
		console.log(`${Math.round(progress.progress.progress * 10000) / 100}% - ${progress.progress.name}`);

		/* Write separator */
		console.log(new Array(width + 1).join('='));

		/* Write set data */
		for(let i = 0; i < columns[0].length; i++) {
			let row = columns[0][i];

			for(let j = 1; j < columnCount; j++) {
				row += '|' + (columns[j][i] ? columns[j][i] : '');
			}

			console.log(row);
		}
	});

	await progress.toPromise();
	await db.close();
}

main().then(() => log.close()).catch(e => console.error(e.stack) || process.exit(1));
