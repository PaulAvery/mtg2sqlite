import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.run(`
		create table artists (
			name text primary key
		)
	`);
};