import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.run(`
		create table supertypes (
			name text primary key
		)
	`);
};