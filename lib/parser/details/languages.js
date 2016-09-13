const page = require('../../cache').getPage;

module.exports = function*(url, card) {
	$languages = yield page(url);
	/* TODO */
};
