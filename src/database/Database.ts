import { Database as SQLite } from 'sqlite3';

import queue from '../queue';
import promise from '../promise';
import { Queryable, QueryError, row, param, params, paramMap, preparedParam, preparedParams } from './Queryable';

/** Escape and quote a column name */
function quoteColumn(column: string) {
	let escapedColumn = column.replace(/\\/g, '\\\\').replace('`', '\`');

	return '`' + escapedColumn + '`';
}

/** Normalize parameters (especially booleans) */
function normalize(param: param) {
	if(typeof param === 'string' || typeof param === 'number') {
		return param;
	} else if(typeof param === 'boolean') {
		return param ? 1 : 0;
	} else {
		return null;
	}
}

/** Prepare data to run a raw SQL query */
function prepare(sql: string, params: (params | paramMap) = []) {
	let processedSQL: string, processedParams: preparedParams;

	if(Array.isArray(params)) {
		processedSQL = sql;
		processedParams = params.map(normalize);
	} else {
		let columnNames = Object.keys(params);

		let columns = columnNames.map(quoteColumn).join(', ');
		let placeholders = columnNames.map(() => '?').join(', ');

		processedSQL = sql.replace('$columns', columns).replace('$values', placeholders);
		processedParams = columnNames.map(c => normalize(params[c]));
	}

	return { processedSQL, processedParams };
}

/** Create a new database. Neccessary because otherwise we would need async constructors */
export async function createDatabase(file: string) {
	return new Promise<Database>((resolve, reject) => {
		let sqlite = new SQLite(file, e => {
			if(e) {
				reject(e);
			} else {
				let db = new Database(sqlite);

				resolve(db.run('PRAGMA foreign_keys = ON').then(() => db));
			}
		});
	});
}

export class Database implements Queryable {
	private lock = queue();

	constructor(protected db: SQLite) {};

	private runQuery(sql: string, params: preparedParams = []) {
		return promise<QueryError, void>(cb => this.db.run(sql, params, cb))
			.catch(e => { throw new QueryError(e, sql, params); });
	}

	private selectQuery(sql: string, params: preparedParams = []) {
		return promise<QueryError, row[]>(cb => this.db.all(sql, params, cb))
			.catch(e => { throw new QueryError(e, sql, params); });
	}

	private insertQuery(sql: string, params: preparedParams = []) {
		return promise<QueryError, string>(cb => this.db.run(sql, params, function(this: { lastID?: string }, e: Error | null) {
			cb(e ? new QueryError(e, sql, params) : null, this.lastID);
		}));
	}

	/** Close the connection */
	public async close() {
		await promise(cb => this.db.close(cb));
	}

	/** Create a new transaction and pass it to the given async function */
	public async transaction<T>(fn: (tr: Queryable) => Promise<T>): Promise<T> {
		let unlock = await this.lock(true);

		await this.runQuery('begin transaction');

		try {
			let res = await fn({
				run: this.run.bind(this),
				select: this.select.bind(this),
				insert: this.insert.bind(this)
			});

			await this.runQuery('commit');

			return res;
		} catch(e) {
			await this.runQuery('rollback');

			throw e;
		} finally {
			unlock();
		}
	}

	/** Run an SQL query without a return value */
	public async run(sql: string, params: (params | paramMap) = []) {
		let { processedSQL, processedParams } = prepare(sql, params);
		let done = await this.lock();

		try {
			return await this.runQuery(processedSQL, processedParams);
		} catch(e) {
			throw e;
		} finally {
			done();
		}
	}

	/** Run an SQL query and return all rows */
	public async select(sql: string, params: (params | paramMap) = []) {
		let { processedSQL, processedParams } = prepare(sql, params);
		let done = await this.lock();

		try {
			return await this.selectQuery(processedSQL, processedParams);
		} catch(e) {
			throw e;
		} finally {
			done();
		}
	}

	/** Run an SQL query and return the last insert ID */
	public async insert(sql: string, params: (params | paramMap) = []) {
		let { processedSQL, processedParams } = prepare(sql, params);
		let done = await this.lock();

		try {
			return await this.insertQuery(processedSQL, processedParams);
		} catch(e) {
			throw e;
		} finally {
			done();
		}
	}
}