import * as url from 'url';
import { getPage as page } from '../../../cache';

import ensureLanguage from '../../ensure/language';
import parseSingleImages from '../../parse/single/images';

type language = { link: string, language: string, translatedLanguage: string };

export default async function processSingleLanguages(uri: string, card: string) {
	let $ = await page(uri);

	let languages: language[] = $('.cardItem').map((i, c) => {
		let $c = $(c);
		let link = url.resolve(uri, $c.find('a').attr('href'));
		let language = $c.find('td:nth-child(2)').text().trim();
		let translatedLanguage = $c.find('td:nth-child(3)').text().trim();

		return { link, language, translatedLanguage };
	}).toArray();

	let filteredLanguages: {[key: string]: language} = {};
	languages.forEach(l => { filteredLanguages[l.language] = l; });

	for(let l of Object.keys(filteredLanguages)) {
		let lang = filteredLanguages[l];
		await ensureLanguage({ name: lang.language, translatedName: lang.translatedLanguage });

		let imageGroup = parseSingleImages(await page(lang.link));
		/* TODO */
	}
};
