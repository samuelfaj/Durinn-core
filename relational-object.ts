import Durinn from "./durinn";
import Query from "./helpers/query";

type PrimaryKey = { [s: string]: string | number };

export default class RelationalObject {
	protected table: string = "";
	protected filter: PrimaryKey = {};

	protected cache: object | undefined = undefined;

	constructor(table: string, filter: PrimaryKey) {
		this.table = table;
		this.filter = filter;
	}

	public get query(): Query {
		const self = this;
		const query = new Durinn.query(self.table);

		for (let i in self.filter) {
			query.where(i, "=", self.filter[i]);
		}

		return query;
	}

	public get data(): Promise<any> {
		const self = this;
		return new Promise<any>(resolve => {
			if (self.cache === undefined) {
				self.get().then(result => {
					resolve(result);
				});
			}

			if (self.cache !== undefined) {
				resolve(self.cache);
			}
		});
	}

	public async get(): Promise<any> {
		const self = this;
		const query = this.query;

		await query.select();

		return (self.cache = query.rows[0] || {});
	}

	public async update(
		field: string | { [s: string]: string | number },
		value?: string | number
	): Promise<boolean> {
		const query = this.query;

		if (typeof field === "object") {
			await query.update(field);
			return query.result;
		}

		if (typeof field === "string" && typeof value !== "undefined") {
			await query.update({ [field]: value });
			return query.result;
		}

		return false;
	}

	public async delete(): Promise<boolean> {
		const query = this.query;

		await query.delete();

		return query.result;
	}
}
