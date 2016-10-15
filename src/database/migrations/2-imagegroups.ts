import { Queryable } from '../Queryable';

export default async (db: Queryable) => {
	await db.run(`
		create table imagegroups (
			id integer primary key
		)
	`);
};