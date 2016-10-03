import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.raw(`
		create table artists (
			name text primary key
		)
	`);
};