import co from 'co';
import Progress from '../../progress';
import parseMain from '../parse/main';

import ensureSet from '../ensure/set';
import ensureFormat from '../ensure/format';
import ensureLanguage from '../ensure/language';

import processSet from './set';
import processDetails from './details';

export default function parse() {
	return new Progress('Import', async p => {
		/* Create the default language */
		await ensureLanguage({ name: 'English', translatedName: 'English' });

		/* Create all set and format entries */
		let { sets, formats } = await parseMain('http://gatherer.wizards.com/');
		await Promise.all(formats.map(ensureFormat));
		await Promise.all(sets.map(ensureSet));

		/* TODO */
		p.attach(Progress.fromPromise(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=414428')));
		p.attach(Progress.fromPromise(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=414429')));
		p.attach(Progress.fromPromise(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=221185')));
		p.attach(Progress.fromPromise(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=221209')));
		p.attach(Progress.fromPromise(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=87599&part=Erayo,+Soratami+Ascendant')));
		p.attach(Progress.fromPromise(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=87599&part=Erayo%27s+Essence')));
		p.attach(Progress.fromPromise(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=369009&part=Breaking')));
		p.attach(Progress.fromPromise(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=369009&part=Entering')));
		p.attach(Progress.fromPromise(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=405234')));
		p.attach(Progress.fromPromise(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=417837')));
		p.attach(Progress.fromPromise(processDetails('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=378521')));
		return;

		/* Now process all sets */
		for(let set of sets) {
			p.attach(processSet(set));
		}
	});
}