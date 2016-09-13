const page = require('../../../cache').getPage;
const parseImage = require('./image');
const ensureImages = require('../../../ensure/images');

module.exports = function*($) {
	/* Create all images and corresponding imagegroup */
	let images = [];
	let $variants = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_variationLinks > a');

	if($variants.length) {
		for(let variant of $variants.toArray()) {
			let id = $(variant).attr('id');
			let url = `http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${id}`;
			let image = yield parseImage(id, yield page(url));

			images.push(image);
		}
	} else {
		let id = $('.cardImage img').attr('src').match(/multiverseid=([0-9]+)/)[1];
		let image = yield parseImage(id, $);

		images.push(image);
	}

	return yield ensureImages(images);
};
