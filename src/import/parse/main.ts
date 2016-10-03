const page = require('../../cache').getPage;

module.exports = function*(url) {
	let $ = yield page(url);

	let formatEls = $('#ctl00_ctl00_MainContent_Content_SearchControls_formatAddText option');
	let formats = formatEls.map((i, e) => $(e).val()).toArray().filter(f => f.length);

	let setEls = $('#ctl00_ctl00_MainContent_Content_SearchControls_setAddText option');
	let sets = setEls.map((i, e) => $(e).val()).toArray().filter(f => f.length);

	return { sets, formats };
};
