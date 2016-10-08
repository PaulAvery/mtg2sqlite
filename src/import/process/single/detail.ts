import { getPage as page } from '../../../cache';

import ensureEntityImages from '../../ensure/entity-images';
import ensureCardEntityLink from '../../ensure/card-entity';
import { ensureCard, ensureCardTitle } from '../../ensure/card';
import { ensureEntity, ensureEntityTitle } from '../../ensure/entity';

import parseSingleCard from '../../parse/single/card';
import parseSingleEntity from '../../parse/single/entity';

import processSingleImages from './images';
import processSingleLanguages from './languages';
import processSingleLegalities from './legalities';

export default async function processSingleDetails(uri: string) {
	let $ = await page(uri);
	let set = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_setRow > .value a:last-child').text().trim();

	/* Parse card and entity */
	let card = await parseSingleCard($);
	let entity = await parseSingleEntity($);

	/* Create card and title */
	let cardId = await ensureCard(card);
	await ensureCardTitle({ cardId, title: card.title, language: 'English' });

	/* Create entity and title */
	let entityId = await ensureEntity(entity);
	await ensureEntityTitle({ entityId, title: entity.title, language: 'English' });

	/* Process images and link them to the entity */
	let imageId = await processSingleImages(uri);
	await ensureEntityImages({ imageGroup: imageId, entity: entityId, language: 'English', set });

	/* Link together card and entity */
	await ensureCardEntityLink({ card: cardId, entity: entity.title });

	/* Process languages and legalities */
	await processSingleLanguages(uri, cardId);
	await processSingleLegalities(uri, cardId);

	return cardId;
};
