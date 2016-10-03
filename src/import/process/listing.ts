const url = require('url');
const page = require('../../cache').getPage;
const Progress = require('../../progress');

const processDetails = require('./details');

module.exports = uri => Progress.make(`Listing page ${uri}`, function*() {
	let $ = yield page(uri);

	/* Add total card count and process them one by one */
	this.addTotal($('.cardTitle').length);

	for(let link of $('.cardTitle > a').toArray()) {
		let target = url.resolve(uri, $(link).attr('href'));

		yield this.attach(processDetails(target), { reserved: true });
	}
});
