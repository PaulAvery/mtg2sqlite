import { Database as SQLite } from 'sqlite3';

import Queryable from './Queryable';
import Transaction from './Transaction';

/** Create a new database */
export default async function initializeDatabase(file: string) {
	return new Promise<SQLite>((resolve, reject) => {
		let db = new SQLite(file, e => {
			if(e) {
				reject(e);
			} else {
				resolve(db);
			}
		});
	});
}

export class Database extends Queryable {
	/** Create a new transaction */
	public async transaction() {
		let tr = await new Transaction(await initializeDatabase(this.file), this.file);

		await tr.run('begin transaction');

		return tr;
	}

	/** Close the connection */
	public async close() {
		return await super.close();
	}
}