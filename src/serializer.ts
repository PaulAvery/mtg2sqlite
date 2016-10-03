module.exports = (rules = {}) => {
	let serialize = value => {
		if(typeof value === rules) {

		}
	};

	return data => {
		let values = [];
		let columns = [];

		for(let column in data) {
			columns.push(column);

			values.push(serialize(data[column]));
		}

		return {
			v: values,
			c: columns,
			p: new Array(columns.length).fill('?').join(', ')
		};
	};
};

