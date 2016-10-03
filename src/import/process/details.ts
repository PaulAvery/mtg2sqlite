const page = require('../../cache').getPage;
const processSingleDetails = require('./single/detail');

module.exports = function*(url) {
	let $ = yield page(url);
	let $components = $('.cardComponentContainer > *');

	if($components.length === 1) {
		/* We got a single image */
		yield processSingleDetails(url);
	} else if($components.length === 2) {
		/* TODO: We got something with two images */
	}
};
