import { Queryable } from '../Queryable';

export default async (db: Queryable) => {
	await db.run(`
		create table subtypes (
			name text primary key
		)
	`);
};