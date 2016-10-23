import database from '../../database';

export type cardFormat = {
	cardId: string,
	legalityId: string,
	formatName: string
};

export async function ensureLegality({ legalityText }: { legalityText: string }) {
	let db = await database;

	await db.insert(
		'replace into legalities ($columns) values ($values)',
		{ text: legalityText }
	);

	return legalityText;
}

export async function ensureCardLegality({ cardId, legalityId, formatName }: cardFormat) {
	let db = await database;

	await db.insert(
		'replace into cards_legalities ($columns) values ($values)',
		{ card_id: cardId, format_name: formatName, legality_text: legalityId }
	);
}
