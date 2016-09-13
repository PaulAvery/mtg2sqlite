const co = require('co');
const url = require('url');
const page = require('../../cache').getPage;
const database = require('../../database');
const parseLanguages = require('./languages');
const parseLegalities = require('./legalities');
const parseSingleCard = require('./card/single');
const parseSingleEntities = require('./entities/single');
const ensureCardEntityLink = require('../../ensure/card-entity');

module.exports = function(uri) {
	return co(function*() {
		let db = yield database;

		try {
			let $ = yield page(uri);
			let $components = $('.cardComponentContainer > *');

			let card, entities;

			if($components.length === 1) {
				/* We got a single image */
				card = yield parseSingleCard($);
				entities = yield parseSingleEntities($);
			} else if($components.length === 2) {
				/* TODO: We got something with two images */
				card = '';
				entities = [];
			}

			/* Stick together card and entities */
			for(let entity of entities) {
				yield ensureCardEntityLink({ card, entity });
			}

			/* Process languages */
			let langUrl = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContentAnchors_DetailsAnchors_LanguagesLink').attr('href');
			yield parseLanguages(url.resolve(uri, langUrl), card);

			/* Process legalities */
			let legalUrl = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContentAnchors_DetailsAnchors_PrintingsLink').attr('href');
			yield parseLegalities(url.resolve(uri, legalUrl), card);
		} catch(e) {
			yield db('errors').insert({ message: e.message, stack: e.stack, type: `Details ${url}` });
		}
	});
};
