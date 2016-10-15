import { getPage as page } from '../../cache';
import processSingleDetails from './single/detail';

export default async function processDetails(url: string) {
	let $ = await page(url);
	let $components = $('.cardComponentContainer > *');

	if($components.length === 1) {
		/* We got a single image */
		await processSingleDetails(url);
	} else if($components.length === 2) {
		/* TODO: We got something with two images */
		throw new Error('Twoparters not implemented');
	}
};
