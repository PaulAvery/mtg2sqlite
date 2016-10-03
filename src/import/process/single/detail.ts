const page = require('../../../cache').getPage;

const ensureEntityImages = require('../../ensure/entity-images');
const ensureCardEntityLink = require('../../ensure/card-entity');
const { ensureCard, ensureCardTitle } = require('../../ensure/card');
const { ensureEntity, ensureEntityTitle } = require('../../ensure/entity');

const parseSingleCard = require('../../parse/single/card');
const parseSingleEntity = require('../../parse/single/entity');

const processSingleImages = require('./images');
const processSingleLanguages = require('./languages');
const processSingleLegalities = require('./legalities');

module.exports = function*(uri) {
	let $ = yield page(uri);
	let set = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_setRow > .value a:last-child').text().trim();

	/* Parse card and entity */
	let card = yield parseSingleCard($);
	let entity = yield parseSingleEntity($);

	/* Create card and title */
	let cardId = yield ensureCard(card);
	yield ensureCardTitle({ cardId, title: card.title, language: 'English' });

	/* Create entity and title */
	let entityId = yield ensureEntity(entity);
	yield ensureEntityTitle({ entityId, title: entity.title, language: 'English' });

	/* Process images and link them to the entity */
	let imageId = yield processSingleImages(uri);
	yield ensureEntityImages({ imageGroup: imageId, entity: entityId, language: 'English', set });

	/* Link together card and entity */
	yield ensureCardEntityLink({ card: card.title, entity: entity.title });

	/* Process languages and legalities */
	//yield processSingleLanguages();
	//yield processSingleLegalities();

	return cardId;
};
