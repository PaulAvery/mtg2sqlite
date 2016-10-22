import * as url from 'url';
import * as cheerio from 'cheerio';
import { getPage as page } from '../../cache';

type language = { link: string, language: string, translatedLanguage: string };

export default function processSingleLanguages($: cheerio.Static) {
	let languages: language[] = $('.cardItem').toArray().map(c => {
		let $c = $(c);
		/* Translated entity names are only within the printed data */
		let link = $c.find('a').attr('href') + '&printed=true';
		let language = $c.find('td:nth-child(2)').text().trim();
		let translatedLanguage = $c.find('td:nth-child(3)').text().trim();

		return { link, language, translatedLanguage };
	});

	/* Remove duplicates and the english language */
	let filteredLanguages = languages.reduce((s: language[], lang: language) => {
		if(!s.find(l => l.language === lang.language) && lang.language !== 'English') {
			s.push(lang);
		}

		return s;
	}, []);

	return filteredLanguages;
};
