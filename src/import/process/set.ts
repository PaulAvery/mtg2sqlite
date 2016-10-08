import Progress from '../../progress';
import { getPage as page } from '../../cache';

import parseSet from '../parse/set';
import processListing from './listing';

export default function processSet(set: string) {
	return new Progress(`Set "${set}"`, async p => {
		let $ = await page(`http://gatherer.wizards.com/Pages/Search/Default.aspx?set=["${set}"]`);

		/* Get the total card count */
		let { pageCount } = parseSet($);

		/* Process all pages */
		for(let i = 1; i <= pageCount; i++) {
			let url = `http://gatherer.wizards.com/Pages/Search/Default.aspx?page=${i - 1}&set=["${set}"]`;

			p.attach(processListing(url));
		}
	});
}