import * as cheerio from 'cheerio';

export default function processLegalities($: cheerio.Static) {
	let rows = $('.cardList:last-of-type .cardItem').toArray();

	let legalities = rows.map(r => {
		return {
			format: $(r).find('td:first-child').text().trim(),
			legality: $(r).find('td:nth-child(2)').text().trim()
		};
	});

	return legalities;
};
