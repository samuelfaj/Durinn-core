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

	protected get query(): Query {
		const self = this;
		const query = new Durinn.query(self.table);

		for (let i in self.filter) {
			query.where(i, "=", self.filter[i]);
		}

		return query;
	}

	protected get data(): Promise<any> {
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

	protected async get(): Promise<any> {
		const query = this.query;

		await query.select();

		return (this.cache = query.rows[0] || null);
	}

	protected async insert(fields: { [s: string]: string | number | null }) {
		const query = this.query;
		const filter = this.filter;

		for (const item in filter) {
			fields[item] = filter[item];
		}

		await query.insert(fields);

		return query.result;
	}

	protected async replace(fields: { [s: string]: string | number | null }) {
		const query = this.query;
		const filter = this.filter;

		for (const item in filter) {
			fields[item] = filter[item];
		}

		await query.replace(fields);

		return query.result;
	}

	protected async update(
		field: string | { [s: string]: string | number | null },
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

	protected async delete(): Promise<boolean> {
		const query = this.query;

		await query.delete();

		return query.result;
	}
}
