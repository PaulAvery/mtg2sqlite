import Queryable from './Queryable';

export default class Transaction extends Queryable {
	public async commit() {
		await this.raw('commit');
		await this.close();
	}

	public async rollback() {
		await this.raw('rollback');
		await this.close();
	}
}