const page = require('../../../cache').getPage;

module.exports = function*(url, card) {
	$legalities = yield page(url);
	/* TODO */
};
