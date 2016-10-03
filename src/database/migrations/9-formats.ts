import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.raw(`
		create table formats (
			name text primary key
		)
	`);
};