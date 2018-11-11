import Query from "./helpers/query";
declare type PrimaryKey = {
	[s: string]: string | number;
};
export default class RelationalObject {
	protected table: string;
	protected filter: PrimaryKey;
	protected cache: object | undefined;
	constructor(table: string, filter: PrimaryKey);
	protected readonly query: Query;
	protected readonly data: Promise<any>;
	protected get(): Promise<any>;
	protected insert(fields: {
		[s: string]: string | number | null;
	}): Promise<boolean>;
	protected replace(fields: {
		[s: string]: string | number | null;
	}): Promise<boolean>;
	protected update(
		field:
			| string
			| {
					[s: string]: string | number | null;
			  },
		value?: string | number
	): Promise<boolean>;
	protected delete(): Promise<boolean>;
}
export {};
