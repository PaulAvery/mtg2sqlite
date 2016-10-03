const ensureArtist = require('../../../ensure/artist');

module.exports = function* (id, $) {
	let cardNumber = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_numberRow > .value').text().trim();
	let artistName = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_artistRow > .value').text().trim();

	/* Create artist */
	yield ensureArtist({ name: artistName });

	/* Return image data */
	return { id, cardNumber, artistName };
};
