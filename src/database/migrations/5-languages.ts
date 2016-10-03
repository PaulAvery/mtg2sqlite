import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.raw(`
		create table languages (
			name text primary key,
			translated_name text unique not null
		)
	`);
};