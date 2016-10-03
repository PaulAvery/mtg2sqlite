import { Database } from 'sqlite3';

/* An error onto which we can attach our sql query and paramters */
class QueryError extends Error {
	constructor(error: Error, public sql: string, public params: (string | number)[]) {
		super(error.message);
	}
}

/* Run a query on the db and do so in awaitable fashion */
function query(db: Database, sql: string, params: (string | number)[]) {
	return new Promise<any[]>((resolve, reject) => {
		db.all(sql, params, (e, rows) => {
			if(e) {
				reject(new QueryError(e, sql, params));
			} else {
				resolve(rows);
			}
		});
	});
}

/* Normalize parameters (especially booleans) */
function normalize(param: string | number | boolean) {
	if(typeof param === 'string' || typeof param === 'number') {
		return param;
	} else {
		return param ? 1 : 0;
	}
}

/* Escape and quote a column name */
function quoteColumn(column: string) {
	let escapedColumn = column.replace(/\\/g, '\\\\').replace('`', '\`');

	return '`' + escapedColumn + '`';
}

export default class Queryable {
	private closed = false;

	constructor(protected db: Database, protected file: string) {}

	/* Close the connection */
	protected close() {
		return new Promise((resolve, reject) => {
			if(this.closed) {
				reject(new Error('Connection is already closed'));
			} else {
				this.closed = true;

				this.db.close(e => {
					if(e) {
						reject(e);
					} else {
						resolve();
					}
				});
			}
		});
	}

	/* Run a raw sql query */
	public async raw(sql: string, params: ((string | number | boolean)[] | {[key: string]: (string | number | boolean)}) = []) {
		let processedSQL: string, processedParams: (string | number)[];

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

		return await query(this.db, processedSQL, processedParams);
	}
}