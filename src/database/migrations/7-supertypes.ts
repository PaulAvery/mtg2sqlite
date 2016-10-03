import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.raw(`
		create table supertypes (
			name text primary key
		)
	`);
};