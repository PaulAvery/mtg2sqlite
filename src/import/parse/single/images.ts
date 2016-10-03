module.exports = function($) {
	/* Create all images and corresponding imagegroup */
	let $variants = $('#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_variationLinks > a');

	if($variants.length) {
		return $variants.toArray().map(v => `http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${$(v).attr('id')}`);
	} else {
		let id = $('.cardImage img').attr('src').match(/multiverseid=([0-9]+)/)[1];

		return [ `http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${id}` ];
	}
};
