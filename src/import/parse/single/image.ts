module.exports = function($) {
	let id = $('.cardImage img').attr('src').match(/multiverseid=([0-9]+)/)[1];
	let cardNumber = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_numberRow > .value').text().trim();
	let artistName = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_artistRow > .value').text().trim();

	/* Return image data */
	return { id, cardNumber, artistName };
};
