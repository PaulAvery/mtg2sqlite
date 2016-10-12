import database from '../../database';

export type cardTitle = {
	title: string,
	cardId: string,
	language: string
};

export type card = {
	title: string,
	rarity: string
};

export async function ensureCardTitle({ title, cardId, language }: cardTitle) {
	let db = await database;
	await db.insert('replace into card_titles ($columns) values ($values)', { title, card_id: cardId, language_name: language });
}

export async function ensureCard({ title, rarity }: card) {
	let db = await database;

	await db.insert('replace into rarities ($columns) values($values)', { text: rarity });
	await db.insert('replace into cards ($columns) values ($values)', { id: title, rarity_text: rarity });

	return title;
}
