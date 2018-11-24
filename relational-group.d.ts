import RelationalObject from "./relational-object";
export declare type GroupsonFilter = {
	[s: string]: string | number | undefined;
};
export declare type Wheres = [string, string, string | number][];
export declare type Limit = [number, number | undefined] | undefined;
export default class RelationalGroup extends RelationalObject {
	table: string;
	args: IArguments;
	_filter: GroupsonFilter;
	_wheres: Wheres;
	_limit: Limit;
	constructor(table: string, args: IArguments, _filter: GroupsonFilter);
	get(wheres?: Wheres, limit?: Limit): Promise<any>;
	where(field: string, operator: string, value: string | number): this;
	limit(limit: number, offset?: number): this;
	getAllData(): Promise<any>;
}
