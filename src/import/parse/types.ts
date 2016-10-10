export default function parseTypes(typeString: string) {
	let types: string[] = [];
	let subtypes: string[] = [];
	let supertypes: string[] = [];

	let dashSides = typeString.split('—').map(p => p.trim());
	let leftSide = dashSides[0].split(/\s/).map(p => p.trim());

	if(leftSide.length > 1) {
		supertypes.push(leftSide[0]);

		types = leftSide.slice(1);
	} else {
		types = leftSide;
	}

	if(dashSides.length > 1) {
		subtypes = dashSides[1].split(/\s/).map(p => p.trim());
	}

	return { types, subtypes, supertypes };
};
