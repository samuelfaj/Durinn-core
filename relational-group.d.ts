import RelationalObject, { PrimaryKey } from "./relational-object";
declare type GroupsonFilter = {
	[s: string]: string | number | undefined;
};
declare type Arguments = {
	table: string;
	father: RelationalObject;
	filter: GroupsonFilter;
	args: IArguments;
	fatherFilter?: PrimaryKey;
};
export default class RelationalGroup extends RelationalObject {
	_arguments: Arguments;
	table: string;
	father: RelationalObject;
	sonFilter: GroupsonFilter;
	args: IArguments;
	fatherFilter?: PrimaryKey;
	constructor(_arguments: Arguments);
	get(wheres?: [string, string, string | number][]): Promise<any>;
	getAllData(wheres?: [string, string, string | number][]): Promise<any>;
}
export {};
