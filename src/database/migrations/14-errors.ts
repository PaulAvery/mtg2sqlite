import Queryable from '../Queryable';

export default async (db: Queryable) => {
	await db.raw(`
		create table \`errors\` (
			timestamp datetime default current_timestamp,

			message text,
			type text,
			stack text
		)
	`);
};