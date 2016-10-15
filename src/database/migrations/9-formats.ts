import { Queryable } from '../Queryable';

export default async (db: Queryable) => {
	await db.run(`
		create table formats (
			name text primary key
		)
	`);
};