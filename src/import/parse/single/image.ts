import * as cheerio from 'cheerio';

export default function parseSingleImage($: cheerio.Static) {
	let idMatch = $('.cardImage img').attr('src').match(/multiverseid=([0-9]+)/);

	if(!idMatch) {
		throw new Error(`Failed to extract multiverseid from url ${$('.cardImage img').attr('src')}`);
	}

	let id = idMatch[1];
	let cardNumber = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_numberRow > .value').text().trim();
	let artistName = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_artistRow > .value').text().trim();

	/* Return image data */
	return { id, cardNumber, artistName };
}
