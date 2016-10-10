import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.run(`
		create table legalities (
			text text primary key
		)
	`);
};