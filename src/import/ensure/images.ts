import database from '../../database';
import { Queryable } from '../../database/Queryable';

export type image = { id: string, cardNumber: string, artistName: string };

async function ensureImageGroup(db: Queryable, images: string[]) {
	let inString = images.map(() => '?').join(',');
	let groupIds = await db.select(`select imagegroup_id from images where id in (${inString}) group by imagegroup_id`, images);

	if(groupIds.length === 0) {
		return await db.insert('insert into imagegroups default values');
	} else if(groupIds.length === 1) {
		return groupIds[0]['imagegroup_id'];
	} else {
		throw new Error(`Tried to create image group for images with different groups: ${JSON.stringify(images)}`);
	}
}

export default async function ensureImages(images: image[]) {
	let db = await database;
	return await db.transaction(async tr => {
		let groupId = await ensureImageGroup(tr, images.map(i => i.id));

		for(let { id, cardNumber, artistName } of images) {
			await tr.insert(
				'replace into images ($columns) values ($values)',
				{
					id,
					cardnumber: cardNumber,
					artist_name: artistName,
					imagegroup_id: groupId
				}
			);
		}

		return groupId;
	});
};
