import * as url from 'url';
import { getPage as page } from '../../../cache';

import ensureLanguage from '../ensure/language';

export default async function processSingleLanguages(uri: string, card: string) {
	let $ = await page(uri);

	let languages = $('.cardItem').map((i, c) => {
		let $c = $(c);
		let link = url.resolve(uri, $c.find('a').attr('href'));
		let language = $c.find('td:nth-child(2)').text().trim();
		let translatedLanguage = $c.find('td:nth-child(3)').text().trim();

		return { link, language, translatedLanguage };
	}).toArray();

	let filteredLanguages = {};
	languages.forEach(l => { filteredLanguages[l.language] = l; });

	for(let l of filteredLanguages) {
		await ensureLanguage({ language: l.language, translatedLanguage: l.translatedLanguage });

		let imageGroup = parseSingleImages(await page(l.link));
		/* TODO */
	}
};
