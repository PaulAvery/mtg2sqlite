import * as cheerio from 'cheerio';

export default function parseMana($: cheerio.Cheerio) {
	return {
		x: !!$.find('img[alt="Variable Colorless"]').length,
		snow: $.find('img[alt="Snow"]').length,
		generic: $.find('img').toArray().map(e => parseFloat(e.attribs['alt'])).filter(n => !isNaN(n)).reduce((a, b) => a + b, 0),
		colorless: $.find('img[alt="Colorless"]').length,

		red: $.find('img[alt="Red"]').length,
		blue: $.find('img[alt="Blue"]').length,
		green: $.find('img[alt="Green"]').length,
		black: $.find('img[alt="Black"]').length,
		white: $.find('img[alt="White"]').length,

		hybridRed: $.find('img[alt="Two or Red"]').length,
		hybridBlue: $.find('img[alt="Two or Blue"]').length,
		hybridGreen: $.find('img[alt="Two or Green"]').length,
		hybridBlack: $.find('img[alt="Two or Black"]').length,
		hybridWhite: $.find('img[alt="Two or White"]').length,

		phyrexianRed: $.find('img[alt="Phyrexian Red"]').length,
		phyrexianBlue: $.find('img[alt="Phyrexian Blue"]').length,
		phyrexianGreen: $.find('img[alt="Phyrexian Green"]').length,
		phyrexianBlack: $.find('img[alt="Phyrexian Black"]').length,
		phyrexianWhite: $.find('img[alt="Phyrexian White"]').length,

		whiteRed: $.find('img[alt="Red or White"]').length,
		whiteBlue: $.find('img[alt="White or Blue"]').length,
		whiteGreen: $.find('img[alt="Green or White"]').length,
		whiteBlack: $.find('img[alt="White or Black"]').length,
		blueRed: $.find('img[alt="Blue or Red"]').length,
		blueGreen: $.find('img[alt="Green or Blue"]').length,
		blueBlack: $.find('img[alt="Blue or Black"]').length,
		blackRed: $.find('img[alt="Black or Red"]').length,
		blackGreen: $.find('img[alt="Black or Green"]').length,
		redGreen: $.find('img[alt="Red or Green"]').length
	};
};
