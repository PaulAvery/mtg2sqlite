import * as cheerio from 'cheerio';

import parseMana from '../mana';
import parseTypes from '../types';

export default function parseSingleEntity($: cheerio.Static) {
	let set = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_setRow > .value a:last-child').text().trim();
	let mana = parseMana($('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_manaRow > .value'));
	let title = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_nameRow > .value').text().trim();
	let types = parseTypes($('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_typeRow > .value').text().trim());

	let $cmc = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_cmcRow > .value');
	let cmc = $cmc.length ? parseFloat($cmc.text()) : 0;

	let $text = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_textRow > .value');
	let text = $text.length ? $text.html().trim() : null;

	let $flavor = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_flavorRow > .value');
	let flavor = $flavor.length ? $flavor.html().trim() : null;

	let $stats = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ptRow > .value');
	let $statType = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ptRow > .label');
	let power: string | null = null;
	let loyalty: string | null = null;
	let toughness: string | null = null;

	if($stats.length) {
		switch($statType.text().trim()) {
			case 'P/T:':
				power = $stats.text().trim().split(' / ')[0];
				toughness = $stats.text().trim().split(' / ')[1];
				break;

			case 'Loyalty':
				loyalty = $stats.text().trim();
				break;
		}
	}

	return {
		set, title, cmc, text, flavor, power, toughness, mana, types, loyalty,

		/* TODO */
		red: false,
		blue: false,
		green: false,
		black: false,
		white: false
	};
};
