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
	readonly data: Promise<any>;
	get(): Promise<any>;
	new(fields: { [s: string]: string | number | null }): Promise<any>;
	insert(fields: { [s: string]: string | number | null }): Promise<boolean>;
	replace(fields: { [s: string]: string | number | null }): Promise<boolean>;
	update(
		field:
			| string
			| {
					[s: string]: string | number | null;
			  },
		value?: string | number
	): Promise<boolean>;
	delete(): Promise<boolean>;
}
export {};
