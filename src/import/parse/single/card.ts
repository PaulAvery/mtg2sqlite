import * as cheerio from 'cheerio';

/* Create the card and corresponding title */
export default function parseSingleCard($: cheerio.Static) {
	let rarity = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_rarityRow > .value').text().trim();
	let title = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContentHeader_subtitleDisplay').text().trim();

	return { rarity, title };
};
