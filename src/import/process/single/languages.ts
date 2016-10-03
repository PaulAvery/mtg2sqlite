const url = require('url');
const page = require('../../../cache').getPage;
const ensureLanguage = require('../../ensure/language');

module.exports = function*(uri, card) {
	let $ = yield page(uri);

	let languages = $('.cardItem').map((i, c) => {
		let $c = $(c);
		let link = url.resolve(uri, $c.find('a').attr('href'));
		let language = $c.find('td:nth-child(2)').text().trim();
		let translatedLanguage = $c.find('td:nth-child(3)').text().trim();

		return { link, language, translatedLanguage };
	}).toArray();

	let filteredLanguages = {};
	languages.forEach(l => { filteredLanguages[l.language] = l; });

	for(let l of filteredLanguages) {
		yield ensureLanguage({ language: l.language, translatedLanguage: l.translatedLanguage });

		let cardTitle = c;
		let imageGroup = parseSingleImages(yield page(l.link));
		/* TODO */
	}
};
