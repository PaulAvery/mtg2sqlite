import * as url from 'url';
import Progress from '../../progress';
import { getPage as page } from '../../cache';

import processDetails from './details';

export default function processListing(uri: string) {
	return new Progress(`Listing page ${uri}`, async p => {
		let $ = await page(uri);

		/* Add total card count and process them one by one */
		p.reserve($('.cardTitle').length);

		for(let link of $('.cardTitle > a').toArray()) {
			let target = url.resolve(uri, $(link).attr('href'));
			let progress = processDetails(target);

			p.attach(Progress.fromPromise(`Details ${target}`, progress), { reserved: true });

			await progress;
		}
	});
}
