const co = require('co');
const database = require('../database');

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

		for(let image of images) {
			yield tr.raw(
				'replace into `images` (id, cardnumber, artist_name, imagegroup_id) values (?, ?, ?, ?)',
				[ image.id, image.cardNumber, image.artistName, groupId ]
			);
		}

		return groupId;
	}));
};
