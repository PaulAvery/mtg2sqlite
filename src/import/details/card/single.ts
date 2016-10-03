const { ensureCard, ensureCardTitle } = require('../../../ensure/card');

/* Create the card and corresponding title */
module.exports = function*($, { language: languageName }) {
	let rarity = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_rarityRow > .value').text().trim();
	let cardTitle = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContentHeader_subtitleDisplay').text().trim();

	yield ensureCard({ title: cardTitle, rarity });
	yield ensureCardTitle({ cardId: cardTitle, title: cardTitle, languageName });

	return cardTitle;
};
