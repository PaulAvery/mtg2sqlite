import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.run(`
		create table rarities (
			text text primary key
		)
	`);
};