import RelationalObject from "./relational-object";

export type GroupsonFilter = { [s: string]: string | number | undefined };
export type Wheres = [string, string, string | number][];

const validFilter = function(sonFilter: any) {
	for (let item in sonFilter) {
		if (typeof sonFilter[item] === "undefined") return false;
	}

	return true;
};

const buildFilter = function(filter: any) {
	let response: any = {};

	for (let item in filter) {
		if (typeof filter[item] !== "undefined") {
			response[item] = filter[item];
		}
	}

	return response;
};

const childFilter = function(filter: any) {
	let response: any = {};

	for (let item in filter) {
		if (typeof filter[item] === "undefined") {
			response[item] = filter[item];
		}
	}

	return response;
};

export default class RelationalGroup extends RelationalObject {
	constructor(
		public table: string,
		public args: IArguments,
		public _filter: GroupsonFilter
	) {
		super(table, buildFilter(_filter));
	}

	public async get(wheres?: Wheres): Promise<any> {
		const self = this;

		if (validFilter(self._filter)) {
			return super.get();
		}

		const query = this.query;

		if (typeof wheres !== "undefined") {
			for (const item of wheres) {
				query.where(item[0], item[1], item[2]);
			}
		}

		const result: RelationalGroup[] = [];

		await query.select(undefined, {
			fields: Object.keys(childFilter(self._filter))
		});

		for (const item of query.rows) {
			let args: any[] = Array.prototype.slice.call(self.args);

			for (let key in item) {
				args.push(item[key]);
			}

			result.push(new (<any>self.constructor)(...args));
		}

		return result;
	}

	public async getAllData(wheres?: Wheres): Promise<any> {
		const response = await this.get(wheres);

		if (response.constructor !== Array) {
			return response;
		}

		let array: any[] = [];

		for (let i in response) {
			array.push(response[i].get());
		}

		return Promise.all(array);
	}
}