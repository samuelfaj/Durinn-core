import { Pool, FieldPacket, QueryError } from "mysql2";
interface Variables {
	sql: string;
	table: string;
	joins: Joins;
	conditions: {
		limit: [] | [number] | [number, number];
		wheres: Wheres;
		orders: Orders;
		groups: Groups;
	};
}
interface Response {
	rows: any[];
	result: boolean;
	fields: FieldPacket[] | null;
	insertId: number | null;
	changedRows: number;
	affectedRows: number;
}
declare type Comparison = ">" | "<" | ">=" | "<=" | "==" | "!=" | "===" | "!==";
declare type Callback = (
	result: boolean,
	response: Response,
	error?: QueryError | null
) => void;
declare type Join = {
	table: string;
	on: {
		from: string;
		to: string;
	}[];
	type: string;
};
declare type Joins = Join[];
declare type Wheres = {
	field: string;
	operator: string;
	value: string;
	escape: boolean;
}[];
declare type Order = "ASC" | "DESC" | "asc" | "desc";
declare type Orders = {
	field: string;
	order: Order;
}[];
declare type Groups = string[];
export default class Query {
	pool: Pool;
	response: Response;
	variables: Variables;
	connection: string;
	constructor(table?: string);
	reset(): void;
	table(name: string): this;
	describe(): Promise<Response>;
	readonly table_fields: Promise<string[]>;
	escape(value: any, escape?: boolean): any;
	escapeId(value: any, escape?: boolean): any;
	where(
		field: string | number,
		operator: string,
		value: string | number,
		escape?: boolean
	): this;
	orderBy(field: string, order?: Order): this;
	groupBy(field: string): this;
	join(
		table: string,
		on:
			| {
					from: string;
					to: string;
			  }[]
			| string,
		to?: string,
		type?: string
	): this;
	limit(records: number, offset?: number): this;
	readonly rows: any[];
	readonly fields: FieldPacket[] | null;
	readonly result: boolean;
	readonly insertId: number | null;
	readonly changedRows: number;
	readonly affectedRows: number;
	exec(
		sql?: string,
		callback?: Callback
	): Promise<[boolean, Response, QueryError | null]>;
	select(
		callback?: Callback,
		params?: {
			fields?: string[];
			ResultCheckBy?: Comparison;
		}
	): Promise<[boolean, Response, QueryError | null]>;
	distinct(
		callback?: Callback,
		params?: {
			fields?: string[];
			ResultCheckBy?: Comparison;
		}
	): Promise<[boolean, Response, QueryError | null]>;
	update(
		update: {
			[s: string]: string | number | null;
		},
		callback?: Callback,
		params?: {
			ResultCheckBy?: Comparison;
			escapeValues?: boolean;
		},
		safeMode?: boolean
	): Promise<(boolean | QueryError | Response | null)[]>;
	insert(
		insert: {
			[s: string]: string | number | null;
		},
		callback?: Callback,
		params?: {
			escapeValues?: boolean;
		}
	): Promise<(boolean | QueryError | Response | null)[]>;
	replace(
		insert: {
			[s: string]: string | number | null;
		},
		callback?: Callback,
		params?: {
			escapeValues?: boolean;
		}
	): Promise<(boolean | QueryError | Response | null)[]>;
	delete(
		callback?: Callback,
		params?: {
			ResultCheckBy?: Comparison;
		},
		safeMode?: boolean
	): Promise<(boolean | QueryError | Response | null)[]>;
	private resetResult;
	private resetVariables;
	private readonly joins;
	private readonly wheres;
	private readonly groups;
	private readonly orders;
	private readonly limits;
	private compare;
}
export {};
