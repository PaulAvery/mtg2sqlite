import database from '../../database';

export type imageEntityLink = {
	imageGroup: string,
	entity: string,
	language: string,
	set: string
};

export default async function({ imageGroup, entity, language, set }: imageEntityLink) {
	let db = await database;

	await db.raw(
		'replace into imagegroups_entities ($columns) values ($values)',
		{
			set_name: set,
			entity_id: entity,
			language_name: language,
			imageGroup_id: imageGroup
		}
	);
}