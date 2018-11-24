import RelationalObject from "./relational-object";
export declare type GroupsonFilter = {
	[s: string]: string | number | undefined;
};
export declare type Wheres = [string, string, string | number][];
export declare type Limit = [number, number] | [number];
export default class RelationalGroup extends RelationalObject {
	table: string;
	args: IArguments;
	_filter: GroupsonFilter;
	constructor(table: string, args: IArguments, _filter: GroupsonFilter);
	get(wheres?: Wheres, limit?: Limit): Promise<any>;
	getAllData(wheres?: Wheres, limit?: Limit): Promise<any>;
}
