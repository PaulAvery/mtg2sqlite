const database = require('../database');

exports.ensureEntityTitle = function*(data) {
	let db = yield database;

	yield db.raw(
		'replace into `entity_titles` (entity_id, title, language_name) values (?, ?, ?)',
		[ data.entityId, data.title, data.languageName ]
	);
};

exports.ensureEntity = function*(data) {
	let db = yield database;

	yield db.raw(
		`replace into \`entities\` (
			id,
			text,
			flavor,
			power,
			toughness,
			loyalty,
			converted_mana_cost,
			red,
			blue,
			green,
			black,
			white,
			cost_x,
			cost_snow,
			cost_generic,
			cost_colorless,
			cost_red,
			cost_blue,
			cost_green,
			cost_black,
			cost_white,
			cost_hybrid_red,
			cost_hybrid_blue,
			cost_hybrid_green,
			cost_hybrid_black,
			cost_hybrid_white,
			cost_phyrexian_red,
			cost_phyrexian_blue,
			cost_phyrexian_green,
			cost_phyrexian_black,
			cost_phyrexian_white,
			cost_white_blue,
			cost_white_black,
			cost_white_red,
			cost_white_green,
			cost_blue_black,
			cost_blue_red,
			cost_blue_green,
			cost_black_red,
			cost_black_green,
			cost_red_green
		) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			data.title,
			data.text,
			data.flavor,
			data.power,
			data.toughness,
			data.loyalty,
			data.cmc,
			data.red,
			data.blue,
			data.green,
			data.black,
			data.white,
			data.mana.x,
			data.mana.snow,
			data.mana.generic,
			data.mana.colorless,
			data.mana.red,
			data.mana.blue,
			data.mana.green,
			data.mana.black,
			data.mana.white,
			data.mana.hybridRed,
			data.mana.hybridBlue,
			data.mana.hybridGreen,
			data.mana.hybridBlack,
			data.mana.hybridWhite,
			data.mana.phyrexianRed,
			data.mana.phyrexianBlue,
			data.mana.phyrexianGreen,
			data.mana.phyrexianBlack,
			data.mana.phyrexianWhite,
			data.mana.whiteBlue,
			data.mana.whiteBlack,
			data.mana.whiteRed,
			data.mana.whiteGreen,
			data.mana.blueBlack,
			data.mana.blueRed,
			data.mana.blueGreen,
			data.mana.blackRed,
			data.mana.blackGreen,
			data.mana.redGreen
		]
	);

	/* Todo: wire up types */
};
