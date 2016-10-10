import promise from '../promise';
import { Database } from 'sqlite3';

/** An error onto which we can attach our sql query and paramters */
class QueryError extends Error {
	constructor(error: Error, public sql: string, public params: (string | number | null)[]) {
		super(error.message);
	}
}

/** Run a query on the db and return nothing */
function runQuery(db: Database, sql: string, params: (string | number | null)[]) {
	return new Promise<void>((resolve, reject) => {
		db.run(sql, params, (e: Error, rows: {[key: string]: string}[]) => {
			if(e) {
				reject(new QueryError(e, sql, params));
			} else {
				resolve();
			}
		});
	});
}

/** Run a query on the db and do so in awaitable fashion */
function selectQuery(db: Database, sql: string, params: (string | number | null)[]) {
	return new Promise<{[key: string]: string}[]>((resolve, reject) => {
		db.all(sql, params, (e: Error, rows: {[key: string]: string}[]) => {
			if(e) {
				reject(new QueryError(e, sql, params));
			} else {
				resolve(rows);
			}
		});
	});
}

/** Run an insert query on the db and do so in awaitable fashion */
function insertQuery(db: Database, sql: string, params: (string | number | null)[]) {
	return new Promise<string[]>((resolve, reject) => {
		let stmt = db.prepare(sql);
		
		stmt.run(params, (e: Error) => {
			if(e) {
				reject(new QueryError(e, sql, params));
			} else {
				/* TODO: Figure out how to properly return ids */
				resolve([]);
			}
		});
	});
}

/** Normalize parameters (especially booleans) */
function normalize(param: string | number | boolean | null) {
	if(typeof param === 'string' || typeof param === 'number') {
		return param;
	} else if(typeof param === 'boolean') {
		return param ? 1 : 0;
	} else {
		return null;
	}
}

/** Escape and quote a column name */
function quoteColumn(column: string) {
	let escapedColumn = column.replace(/\\/g, '\\\\').replace('`', '\`');

	return '`' + escapedColumn + '`';
}

export default class Queryable {
	private closed = false;

	constructor(protected db: Database, protected file: string) {}

	/** Close the connection */
	protected async close() {
		if(this.closed) {
			throw new Error('Connection is already closed');
		}

		this.closed = true;
		await promise(cb => this.db.close(cb));
	}

	/** Run a raw sql query */
	public prepare(sql: string, params: ((string | number | boolean | null)[] | {[key: string]: (string | number | boolean | null)}) = []) {
		let processedSQL: string, processedParams: (string | number | null)[];

		if(this.closed) {
			throw new Error('Connection already closed');
		}

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

	public async run(sql: string, params: ((string | number | boolean | null)[] | {[key: string]: (string | number | boolean | null)}) = []) {
		let { processedSQL, processedParams } = this.prepare(sql, params);

		return await runQuery(this.db, processedSQL, processedParams);
	}

	public async select(sql: string, params: ((string | number | boolean | null)[] | {[key: string]: (string | number | boolean | null)}) = []) {
		let { processedSQL, processedParams } = this.prepare(sql, params);

		return await selectQuery(this.db, processedSQL, processedParams);
	}

	public async insert(sql: string, params: ((string | number | boolean | null)[] | {[key: string]: (string | number | boolean | null)}) = []) {
		let { processedSQL, processedParams } = this.prepare(sql, params);

		return await insertQuery(this.db, processedSQL, processedParams);
	}
}