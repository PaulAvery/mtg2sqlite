export type row = {[key: string]: string};
export type param = string | number | boolean | null;
export type params = param[];
export type paramMap = {[key: string]: param};
export type preparedParam = string | number | null;
export type preparedParams = preparedParam[];

/** An error onto which we can attach our sql query and paramters */
export class QueryError extends Error {
	constructor(error: Error, public sql: string, public params: preparedParams) {
		super(error.message);
	}

	public toString() {
		let string = '';

		string += `Database Error\n`;
		string += `==============\n`;
		string += `Query: ${this.sql}\n`;
		string += `Data:  [${this.params.map(p => typeof p === 'string' ? "'" + p + "'" : p).join(', ')}]\n`;
		string += this.stack;

		return string;
	}
}

export interface Queryable {
	/** Run an SQL query without a return value */
	run(sql: string, params?: (params | paramMap)): Promise<void>;

	/** Run an SQL query and return all rows */
	select(sql: string, params?: (params | paramMap)): Promise<row[]>;

	/** Run an SQL query and return the last insert ID */
	insert(sql: string, params?: (params | paramMap)): Promise<string>;
}