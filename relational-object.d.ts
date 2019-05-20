import Query from "./helpers/query";
export declare type PrimaryKey = {
	[s: string]: string | number;
};
export default class RelationalObject {
	table: string;
	filter: PrimaryKey;
	last: {
		query: Query;
	};
	joins: IArguments[];
	protected cache: object | undefined;
	constructor(table: string, filter: PrimaryKey);
	readonly query: Query;
	readonly data: Promise<any>;
	get(): Promise<any>;
	insert(
		fields: {
			[s: string]: string | number | null;
		},
		insert_filter?: boolean
	): Promise<number | false>;
	replace(
		fields: {
			[s: string]: string | number | null;
		},
		insert_filter?: boolean
	): Promise<boolean>;
	update(
		field:
			| string
			| {
					[s: string]: string | number | null;
			  },
		value?: string | number
	): Promise<boolean>;
	delete(): Promise<boolean>;
	protected join(
		table: string,
		on:
			| {
					from: string;
					to: string;
			  }[]
			| string,
		to?: string,
		type?: string
	): void;
}
