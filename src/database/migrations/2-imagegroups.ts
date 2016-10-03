import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.raw(`
		create table imagegroups (
			id integer primary key
		)
	`);
};