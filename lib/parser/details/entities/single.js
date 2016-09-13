const parseEntity = require('./entity');
const parseSingleImages = require('../images/single');
const ensureEntityImages = require('../../../ensure/entity-images');
const { ensureEntity, ensureEntityTitle } = require('../../../ensure/entity');

module.exports = function*($) {
	let set = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_setRow > .value a:last-child').text().trim();

	/* Create the entity and corresponding title */
	let entity = parseEntity($);
	yield ensureEntity(entity);
	yield ensureEntityTitle({ entityId: entity.title, title: entity.title, languageName: 'English' });

	/* Wire up images */
	let imageGroup = yield parseSingleImages($);
	yield ensureEntityImages({ set, language: 'English', entity: entity.title, imageGroup });

	return [entity.title];
};
