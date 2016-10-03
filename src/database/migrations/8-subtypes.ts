import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.raw(`
		create table subtypes (
			name text primary key
		)
	`);
};