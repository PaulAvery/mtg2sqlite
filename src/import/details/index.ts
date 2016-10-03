const co = require('co');
const url = require('url');
const page = require('../../cache').getPage;
const database = require('../../database');
const parseLegalities = require('./legalities');
const parseSingleCard = require('./card/single');
const parseSingleEntities = require('./entities/single');
const parseSingleLanguages = require('./languages/single');
const ensureCardEntityLink = require('../../ensure/card-entity');

module.exports = function(uri, language = { language: 'English', translatedLanguage: 'English' }) {
	return co(function*() {
		let db = yield database;

		try {
			let $ = yield page(uri);
			let $components = $('.cardComponentContainer > *');
			let langUrl = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContentAnchors_DetailsAnchors_LanguagesLink').attr('href');
			let legalUrl = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContentAnchors_DetailsAnchors_PrintingsLink').attr('href');

			let card, entities;

			if($components.length === 1) {
				/* We got a single image */
				card = yield parseSingleCard($, language);
				entities = yield parseSingleEntities($, language);

				/* Process languages and legalities */
				yield parseLegalities(url.resolve(uri, legalUrl), card);
				yield parseSingleLanguages(url.resolve(uri, langUrl), card);
			} else if($components.length === 2) {
				/* TODO: We got something with two images */
				card = '';
				entities = [];
			}

			/* Stick together card and entities */
			for(let entity of entities) {
				yield ensureCardEntityLink({ card, entity });
			}
		} catch(e) {
			yield db('errors').insert({ message: e.message, stack: e.stack, type: `Details ${url}` });
		}
	});
};
