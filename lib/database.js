const co = require('co');
const fs = require('fs');
const path = require('path');
const knex = require('knex');

const dbFile = path.join(process.cwd(), 'mtg.sqlite');
const migrationDir = path.join(__dirname, 'migrations');

function* migrate(db) {
	/* Load all migrations */
	let migrations = fs.readdirSync(migrationDir)
		.sort((a, b) => parseInt(a) - parseInt(b))
		.map(f => path.join(migrationDir, f))
		.map(require);

	/* Create migrations table if neccessary */
	yield db.schema.createTableIfNotExists('migrations', table => {
		table.integer('id');
	});

	/* Get latest applied migration */
	let ids = yield db.select('id').from('migrations').orderBy('id', 'desc').limit(1);
	let latest = ids.length ? parseInt(ids[0].id) : 0;

	let needed = migrations.slice(latest);

	for(let i = 0; i < needed.length; i++) {
		yield db.transaction(t => co(needed[i](t)));
		yield db.insert({ id: latest + i + 1 }).into('migrations');
	}
}

function* createDatabase() {
	let db = knex({
		client: 'sqlite3',
		useNullAsDefault: true,
		connection: {
			filename: dbFile
		}
	});

	yield db.raw('PRAGMA foreign_keys = ON;');
	yield migrate(db);

	return db;
}

module.exports = co(createDatabase);
