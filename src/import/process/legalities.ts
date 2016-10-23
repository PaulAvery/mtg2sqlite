import {getPage as page} from '../../cache';

import parseLegalities from '../parse/legalities';
import { ensureLegality, ensureCardLegality } from '../ensure/legality';

export default async function processSingleLegalities(url: string, cardId: string) {
	let $ = await page(url);
	let legalities = parseLegalities($);

	for(let { legality: legalityText, format: formatName } of legalities) {
		let legalityId = await ensureLegality({ legalityText });

		await ensureCardLegality({ legalityId, formatName, cardId });
	}
};
