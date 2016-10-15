import { Queryable } from '../Queryable';

export default async (db: Queryable) => {
	await db.run(`
		create table sets (
			name text primary key
		)
	`);
};