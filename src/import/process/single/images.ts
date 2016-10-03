const page = require('../../../cache').getPage;

const parseSingleImage = require('../../parse/single/image');
const parseSingleImages = require('../../parse/single/images');

const ensureArtist = require('../../ensure/artist');
const ensureImages = require('../../ensure/images');

module.exports = function*(url) {
	let $ = yield page(url);

	/* Find all images */
	let urls = parseSingleImages($);

	/* Parse specific image data for each image */
	let images = (yield Promise.all(urls.map(page))).map(parseSingleImage);

	/* Create artists */
	for(let { artistName } of images) {
		yield ensureArtist({ name: artistName });
	}

	/* Create Imagegroup and images */
	return yield ensureImages(images);
};
