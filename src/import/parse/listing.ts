import * as cheerio from 'cheerio';

export default function parseListing($: cheerio.Static) {
	/* Get the first pagination */
	let pager = $('.pagingcontrols').first();
	let pagelinks = pager.find('a');

	/* Try to sort the links (why would they not use classnames?) */
	let directs = pagelinks.filter((i, l) => $(l).text().slice(-1) !== '>');
	let lastPage = pagelinks.filter((i, l) => $(l).text() === '>>');

	/*
	 * Based on what links were found (>> is not always there),
	 * figure out how many pages there are.
	 */
	let pageCount = 1;
	if(lastPage.length > 0) {
		/* Extract the target page from the href link */
		let pageMatch = lastPage.attr('href').match(/page=([0-9]+)/);
		if(!pageMatch) {
			throw new Error(`Failed to extract page from url ${lastPage.attr('href')}`);
		}
		pageCount = parseInt(pageMatch[1]) + 1;
	} else if(directs.length > 0) {
		pageCount = directs.length;
	}

	return { pageCount };
}
