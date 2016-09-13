/* Transform an insert statement into an insert or replace */
module.exports = function upsert(query) {
	return query.client.raw(query.toString().replace(/^insert/i, 'insert or replace'));
};
