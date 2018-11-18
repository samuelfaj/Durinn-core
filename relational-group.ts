import RelationalObject, { PrimaryKey } from "./relational-object";

type GroupsonFilter = { [s: string]: string | number | undefined };

type Arguments = {
	table: string;
	father: RelationalObject;
	filter: GroupsonFilter;
	args: IArguments;
	fatherFilter?: PrimaryKey;
};

const validFilter = function(sonFilter: any) {
	for (let item in sonFilter) {
		if (typeof sonFilter[item] === "undefined") return false;
	}

	return true;
};

export default class RelationalGroup extends RelationalObject {
	table: string;
	father: RelationalObject;
	sonFilter: GroupsonFilter;
	args: IArguments;
	fatherFilter?: PrimaryKey;

	constructor(public _arguments: Arguments) {
		super(
			_arguments.table,
			Object.assign(
				_arguments.fatherFilter || _arguments.father.filter,
				validFilter(_arguments.filter) ? _arguments.filter : {}
			)
		);

		this.table = _arguments.table;
		this.father = _arguments.father;
		this.sonFilter = _arguments.filter;
		this.args = _arguments.args;
		this.fatherFilter = _arguments.fatherFilter;
	}

	public async get(
		wheres?: [string, string, string | number][]
	): Promise<any> {
		const self = this;

		if (validFilter(self.sonFilter)) {
			return super.get();
		}

		const query = this.query;

		if (typeof wheres !== "undefined") {
			for (const item of wheres) {
				query.where(item[0], item[1], item[2]);
			}
		}

		const result: RelationalGroup[] = [];

		await query.select(undefined, { fields: Object.keys(self.sonFilter) });

		for (const item of query.rows) {
			let args: any[] = Array.prototype.slice.call(self.args);

			for (let key in item) {
				args.push(item[key]);
			}

			result.push(new (<any>self.constructor)(...args));
		}

		return result;
	}

	public async getAllData(
		wheres?: [string, string, string | number][]
	): Promise<any> {
		const response = await this.get(wheres);

		let array: any[] = [];

		for (let item of response) {
			console.log(await item.get());

			array.push(item.get());
		}

		return Promise.all(array);
	}
}
