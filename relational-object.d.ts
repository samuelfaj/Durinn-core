import Query from "./helpers/query";
declare type PrimaryKey = {
	[s: string]: string | number;
};
export default class RelationalObject {
	protected table: string;
	protected filter: PrimaryKey;
	protected cache: object | undefined;
	constructor(table: string, filter: PrimaryKey);
	readonly query: Query;
	readonly data: Promise<object>;
	get(): Promise<object>;
	update(field: string, value: string | number): Promise<boolean>;
	delete(): Promise<boolean>;
}
export {};
