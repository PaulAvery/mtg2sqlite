const page = require('../cache').getPage;
const Progress = require('../progress');
const parseListing = require('./listing');

function* getPageCount($) {
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
		pageCount = parseInt(lastPage.attr('href').match(/page=([0-9]+)/)[1]) + 1;
	} else if(directs.length > 0) {
		pageCount = directs.length;
	}

	return pageCount;
}

module.exports = function(set) {
	return Progress.make(`Set "${set}"`, function* () {
		let $ = yield page(`http://gatherer.wizards.com/Pages/Search/Default.aspx?set=["${set}"]`);

		/* Get the total card count */
		let pageCount = yield getPageCount($);

		/* Process all pages */
		for(let i = 1; i <= pageCount; i++) {
			this.attach(parseListing(set, i));
		}
	});
};
