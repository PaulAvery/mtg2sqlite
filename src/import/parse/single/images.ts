import * as cheerio from 'cheerio';

export default function parseSingleImages($: cheerio.Static) {
	/* Create all images and corresponding imagegroup */
	let $variants = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_variationLinks > a');

	if($variants.length) {
		return $variants.toArray().map(v => `http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${$(v).attr('id')}`);
	} else {
		let idMatch = $('.cardImage img').attr('src').match(/multiverseid=([0-9]+)/);

		if(!idMatch) {
			throw new Error(`Failed to extract multiverseid from url ${$('.cardImage img').attr('src')}`);
		}

		return [ `http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${idMatch[1]}` ];
	}
}
