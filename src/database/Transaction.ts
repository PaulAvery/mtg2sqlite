import Queryable from './Queryable';

export default class Transaction extends Queryable {
	public async commit() {
		await this.run('commit');
		await this.close();
	}

	public async rollback() {
		await this.run('rollback');
		await this.close();
	}
}