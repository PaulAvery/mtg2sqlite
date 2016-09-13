const page = require('../cache').getPage;
const upsert = require('../upsert');
const parseSet = require('./set');
const parseCard = require('./details');
const Progress = require('../progress');
const ensureLanguage = require('../ensure/language');

module.exports = function() {
	return Progress.make('Import',
		/* Clear out all existing import errors first */
		db => db('errors').truncate(),

		function*(db) {
			/* Create the default language */
			yield ensureLanguage({ name: 'English', translatedName: 'English' });

			/* Start by getting the main page */
			let $ = yield page('http://gatherer.wizards.com/');

			let formatEls = $('#ctl00_ctl00_MainContent_Content_SearchControls_formatAddText option');
			let formats = formatEls.map((i, e) => $(e).val()).toArray().filter(f => f.length);

			let setEls = $('#ctl00_ctl00_MainContent_Content_SearchControls_setAddText option');
			let sets = setEls.map((i, e) => $(e).val()).toArray().filter(f => f.length);

			/* Save formats and sets */
			yield Promise.all(formats.map(format => upsert(db('formats').insert({ name: format }))));
			yield Promise.all(sets.map(set => upsert(db('sets').insert({ name: set }))));

			/* TODO */
			this.attach(parseCard('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=414428'));
			this.attach(parseCard('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=414429'));
			this.attach(parseCard('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=221185'));
			this.attach(parseCard('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=221209'));
			this.attach(parseCard('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=87599&part=Erayo,+Soratami+Ascendant'));
			this.attach(parseCard('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=87599&part=Erayo%27s+Essence'));
			this.attach(parseCard('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=369009&part=Breaking'));
			this.attach(parseCard('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=369009&part=Entering'));
			this.attach(parseCard('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=405234'));
			this.attach(parseCard('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=417837'));
			this.attach(parseCard('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=378521'));
			return;

			for(let set of sets) {
				this.attach(parseSet(set));
			}
		}
	);
};
