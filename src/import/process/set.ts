const page = require('../../cache').getPage;
const Progress = require('../../progress');

const parseSet = require('../parse/set');
const processListing = require('./listing');

module.exports = set => Progress.make(`Set "${set}"`, function* () {
	let $ = yield page(`http://gatherer.wizards.com/Pages/Search/Default.aspx?set=["${set}"]`);

	/* Get the total card count */
	let { pageCount } = parseSet($);

	/* Process all pages */
	for(let i = 1; i <= pageCount; i++) {
		let url = `http://gatherer.wizards.com/Pages/Search/Default.aspx?page=${i - 1}&set=["${set}"]`;

		this.attach(processListing(url));
	}
});
