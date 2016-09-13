const page = require('../cache').getPage;
const Progress = require('../progress');
const parseDetails = require('./details');

module.exports = function(set, number) {
	return Progress.make(`Listing page ${number}`, function*() {
		let $ = yield page(`http://gatherer.wizards.com/Pages/Search/Default.aspx?page=${number - 1}&set=["${set}"]`);

		this.addTotal($('.cardTitle').length);

		for(let link of $('.cardTitle > a').toArray()) {
			let url = 'http://gatherer.wizards.com/Pages/Search/' + $(link).attr('href');

			yield this.attach(parseDetails(url), { reserved: true });
		}
	});
};
