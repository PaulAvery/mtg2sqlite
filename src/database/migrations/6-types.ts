import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.run(`
		create table types (
			name text primary key
		)
	`);
};