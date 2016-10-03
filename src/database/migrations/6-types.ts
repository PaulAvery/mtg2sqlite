import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.raw(`
		create table types (
			name text primary key
		)
	`);
};