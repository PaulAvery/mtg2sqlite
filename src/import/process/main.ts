const co = require('co');
const Progress = require('../../progress');
const parseMain = require('../parse/main');

const ensureSet = require('../ensure/set');
const ensureFormat = require('../ensure/format');
const ensureLanguage = require('../ensure/language');

const processSet = require('./set');
const processDetails = require('./details');

module.exports = () => Progress.make('Import',
	db => db('errors').truncate(),

	function*() {
		/* Create the default language */
		yield ensureLanguage({ name: 'English', translatedName: 'English' });

		/* Create all set and format entries */
		let { sets, formats } = yield parseMain('http://gatherer.wizards.com/');
		yield Promise.all(formats.map(ensureFormat));
		yield Promise.all(sets.map(ensureSet));

		/* TODO */
		this.attach(co(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=414428')));
		this.attach(co(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=414429')));
		this.attach(co(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=221185')));
		this.attach(co(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=221209')));
		this.attach(co(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=87599&part=Erayo,+Soratami+Ascendant')));
		this.attach(co(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=87599&part=Erayo%27s+Essence')));
		this.attach(co(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=369009&part=Breaking')));
		this.attach(co(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=369009&part=Entering')));
		this.attach(co(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=405234')));
		this.attach(co(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=417837')));
		this.attach(co(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=378521')));
		return;

		/* Now process all sets */
		for(let set of sets) {
			this.attach(processSet(set));
		}
	}
);
