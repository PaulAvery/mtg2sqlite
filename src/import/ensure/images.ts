import co from 'co';
import database from '../../database';

function* ensureImageGroup(db, images) {
	let groupIds = yield db.select('imagegroup_id').from('images').whereIn('id', images).groupBy('imagegroup_id');

	if(groupIds.length === 0) {
		let ids = yield db.insert({}).into('imagegroups');

		return ids[0];
	} else if(groupIds.length === 1) {
		return groupIds[0].imagegroup_id;
	} else {
		throw new Error(`Tried to create image group for images with different groups: ${JSON.stringify(images)}`);
	}
}

module.exports = function*(images) {
	let db = yield database;

	return yield db.transaction(co.wrap(function*(tr) {
		let groupId = yield ensureImageGroup(tr, images.map(i => i.id));

		for(let { id, cardNumber, artistName } of images) {
			let query = tr.insert({
				id,
				card_number: cardNumber,
				artist_name: artistName,
				imagegroup_id: groupId
			}).into('images');

			yield database.upsert(query);
		}

		return groupId;
	}));
};
