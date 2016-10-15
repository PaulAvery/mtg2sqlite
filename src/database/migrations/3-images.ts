import { Queryable } from '../Queryable';

export default async (db: Queryable) => {
	await db.run(`
		create table images (
			id integer primary key,
			cardnumber text,
			artist_name text not null references artists(name),
			imagegroup_id integer not null references imagegroups(id)
		)
	`);
};