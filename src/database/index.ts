import * as fs from 'fs';
import * as path from 'path';
import { verbose } from 'sqlite3';
import Queryable from './Queryable';
import { default as initializeDatabase, Database } from './Database';

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
		let tr = await db.transaction();
		let migration = needed[i];

		try {
			await migration(tr);
			await tr.insert('insert into `migrations` (id) values (?)', [latest + i + 1]);
		} catch(e) {
			await tr.rollback();

			throw e;
		}

		await tr.commit();
	}

	return db;
}

/** Create the original database connection and run migratrions */
async function createRootDb() {
	if(debug) {
		verbose();
	}

	let database = new Database(await initializeDatabase(file), file);
	await database.run('PRAGMA foreign_keys = ON');

	return await applyMigrations(database);
}

export default createRootDb();