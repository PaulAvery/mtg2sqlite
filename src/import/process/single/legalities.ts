import {getPage as page} from '../../../cache';

export default async function processSingleLegalities(url: string, card: string) {
	let $ = await page(url);
	/* TODO */
};
