const database = require('../../database');

exports.ensureEntityTitle = function*({ title, entityId, language }) {
	let db = yield database;
	let query = db.insert({ title, entity_id: entityId, language_name: language }).into('card_title');

	yield database.upsert(query);
};

exports.ensureEntity = function*(data) {
	let db = yield database;

	let query = db.insert({
		id: data.title,
		text: data.text,
		flavor: data.flavor,
		power: data.power,
		toughness: data.toughness,
		loyalty: data.loyalty,
		converted_mana_cost: data.cmc,
		red: data.red,
		blue: data.blue,
		green: data.green,
		black: data.black,
		white: data.white,
		cost_x: data.mana.x,
		cost_snow: data.mana.snow,
		cost_generic: data.mana.generic,
		cost_colorless: data.mana.colorless,
		cost_red: data.mana.red,
		cost_blue: data.mana.blue,
		cost_green: data.mana.green,
		cost_black: data.mana.black,
		cost_white: data.mana.white,
		cost_hybrid_red: data.mana.hybridRed,
		cost_hybrid_blue: data.mana.hybridBlue,
		cost_hybrid_green: data.mana.hybridGreen,
		cost_hybrid_black: data.mana.hybridBlack,
		cost_hybrid_white: data.mana.hybridWhite,
		cost_phyrexian_red: data.mana.phyrexianRed,
		cost_phyrexian_blue: data.mana.phyrexianBlue,
		cost_phyrexian_green: data.mana.phyrexianGreen,
		cost_phyrexian_black: data.mana.phyrexianBlack,
		cost_phyrexian_white: data.mana.phyrexianWhite,
		cost_white_blue: data.mana.whiteBlue,
		cost_white_black: data.mana.whiteBlack,
		cost_white_red: data.mana.whiteRed,
		cost_white_green: data.mana.whiteGreen,
		cost_blue_black: data.mana.blueBlack,
		cost_blue_red: data.mana.blueRed,
		cost_blue_green: data.mana.blueGreen,
		cost_black_red: data.mana.blackRed,
		cost_black_green: data.mana.blackGreen,
		cost_red_green: data.mana.redGreen
	}).into('entities');

	yield database.upsert(query);

	return data.title;
};
