import * as fs from 'fs';
import * as path from 'path';
import { verbose } from 'sqlite3';
import { Queryable } from './Queryable';
import { createDatabase, Database } from './Database';

const file = path.join(__dirname, '../../mtg.sqlite');
const debug = process.env['NODE_ENV'] !== 'production';
const migrationDir = path.join(__dirname, 'migrations');

/** Apply all required migrations in order */
async function applyMigrations(db: Database) {
	/* Load all migrations */
	let migrations: ((db: Queryable) => Promise<void>)[] = fs.readdirSync(migrationDir)
		.filter(e => path.extname(e) === '.js')
		.sort((a, b) => parseInt(a) - parseInt(b))
		.map(f => path.join(migrationDir, f))
		.map(f => require(f).default);

	/* Create migrations table if neccessary */
	await db.run('create table if not exists `migrations` (id integer)');

	/* Get latest applied migration */
	let ids = await db.select('select id from `migrations` order by `id` desc limit 1');
	let latest = ids.length ? parseInt(ids[0]['id']) : 0;

	/* Apply only neccessary migrations */
	let needed = migrations.slice(latest);
	for(let i = 0; i < needed.length; i++) {
		await db.transaction(async tr => {
			await needed[i](tr);
			await tr.insert('insert into `migrations` (id) values (?)', [latest + i + 1]);
		});
	}

	return db;
}

/** Create the original database connection and run migratrions */
async function createRootDb() {
	if(debug) {
		verbose();
	}

	return await applyMigrations(await createDatabase(file));
}

export default createRootDb();