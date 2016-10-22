import * as url from 'url';
import { getPage as page } from '../../../cache';

import parseLanguages from '../../parse/languages';
import parseSingleCard from '../../parse/single/card';
import parseSingleEntity from '../../parse/single/entity';

import ensureLanguage from '../../ensure/language';
import { ensureCardTitle } from '../../ensure/card';
import { ensureEntityTitle } from '../../ensure/entity';

type language = { link: string, language: string, translatedLanguage: string };

export default async function processSingleLanguages(uri: string, cardId: string, entityId: string) {
	let $ = await page(uri);
	let languages = parseLanguages($);

	for(let { language, translatedLanguage, link } of languages) {
		let absoluteLink = url.resolve(uri, link);

		let $card = await page(absoluteLink);
		let { title: cardTitle } = parseSingleCard($card);
		let { title: entityTitle } = parseSingleEntity($card);

		await ensureLanguage({ name: language, translatedName: translatedLanguage });
		await ensureCardTitle({ title: cardTitle, cardId, language });
		await ensureEntityTitle({ title: entityTitle, entityId, language });
	}
};
