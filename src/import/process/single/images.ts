import { getPage as page } from '../../../cache';

import parseSingleImage from '../../parse/single/image';
import parseSingleImages from '../../parse/single/images';

import ensureArtist from '../../ensure/artist';
import ensureImages from '../../ensure/images';

export default async function processSingleImages(url: string) {
	let $ = await page(url);

	/* Find all images */
	let urls = parseSingleImages($);

	/* Parse specific image data for each image */
	let images = (await Promise.all(urls.map(page))).map(parseSingleImage);

	/* Create artists */
	for(let { artistName } of images) {
		await ensureArtist({ name: artistName });
	}

	/* Create Imagegroup and images */
	return await ensureImages(images);
};
