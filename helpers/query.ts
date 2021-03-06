"use strict";

/**
 * Durinn Mysql Query builder and executor
 * ----------------------------------------------------
 * Example
 * ----------------------------------------------------
 * // - You can use it with callback or promise systems
 *
 *  let query =
 *      (new Durinn.query('person'))
 *          .where('name','like','Samuel')
 *          .orderBy('name','desc')
 *          .groupBy('name')
 *          .select(function(result, response){
 *              console.log(result, response.rows);
 *          });
 *
 *  query.then(([result, response, error]) => {
 *      console.log(result);
 *      console.log(response);
 *      console.log(error);
 *  });
 * ----------------------------------------------------
 */

import Durinn from "../durinn";
import { Pool, FieldPacket, QueryError } from "mysql2";

const mysql = require("mysql");

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

type Comparison = ">" | "<" | ">=" | "<=" | "==" | "!=" | "===" | "!==";

type Callback = (
	result: boolean,
	response: Response,
	error?: QueryError | null
) => void;

type Join = { table: string; on: { from: string; to: string }[]; type: string };
type Joins = Join[];
type Wheres = {
	field: string;
	operator: string;
	value: string;
	escape: boolean;
}[];
type Order = "ASC" | "DESC" | "asc" | "desc";
type Orders = { field: string; order: Order }[];
type Groups = string[];

export default class Query {
	pool: Pool;
	response: Response;
	variables: Variables;
	connection = "release";

	constructor(table?: string) {
		this.pool = Durinn.pool;

		this.variables = {
			sql: "",
			joins: [],
			table: table || "",
			conditions: {
				limit: [],
				wheres: [],
				orders: [],
				groups: []
			}
		};

		this.response = {
			rows: [],
			fields: null,
			result: false,
			insertId: null,
			changedRows: 0,
			affectedRows: 0
		};
	}

	public reset() {
		this.resetResult();
		this.resetVariables();
	}

	public table(name: string): this {
		this.variables.table = name;
		return this;
	}

	public async describe() {
		const self = this;
		const [result, response, error] = await new Query().exec(
			"DESCRIBE " + self.variables.table
		);
		return response;
	}

	public get table_fields(): Promise<string[]> {
		const self = this;
		return new Promise(async resolve => {
			const fields = [];
			const describe = await self.describe();
			for (let item of describe.rows) {
				fields.push(item.Field);
			}

			resolve(fields);
		});
	}

	public escape(value: any, escape: boolean = true) {
		if (escape === false) return value;
		if (value === null) return "null";

		return mysql.escape(value);
	}

	public escapeId(value: any, escape: boolean = true) {
		if (escape === false) return value;

		return mysql.escapeId(value);
	}

	public where(
		field: string | number,
		operator: string,
		value: string | number,
		escape = true
	) {
		this.variables.conditions.wheres.push({
			field: field.toString(),
			operator: operator,
			value: value.toString(),
			escape: escape
		});

		return this;
	}

	public orderBy(field: string, order: Order = "ASC") {
		this.variables.conditions.orders.push({ field: field, order: order });

		return this;
	}

	public groupBy(field: string) {
		this.variables.conditions.groups.push(field);

		return this;
	}

	public join(
		table: string,
		on: { from: string; to: string }[] | string,
		to?: string,
		type = "INNER"
	) {
		let join: Join = { table: table, on: [], type: type };

		if (typeof on === "object") {
			join.on = on;
		}

		if (typeof on === "string" && typeof to === "string") {
			join.on = [{ from: on, to: to }];
		}

		this.variables.joins.push(join);

		return this;
	}

	public limit(records: number, offset?: number) {
		if (typeof offset === "number") {
			this.variables.conditions.limit = [records, offset];
		} else {
			this.variables.conditions.limit = [records];
		}

		return this;
	}

	public get rows() {
		return this.response.rows;
	}

	public get fields() {
		return this.response.fields;
	}

	public get result() {
		return this.response.result;
	}

	public get insertId() {
		return this.response.insertId;
	}

	public get changedRows() {
		return this.response.changedRows;
	}

	public get affectedRows() {
		return this.response.affectedRows;
	}

	public async exec(
		sql?: string,
		callback?: Callback
	): Promise<[boolean, Response, QueryError | null]> {
		const self = this;

		self.variables.sql = sql || self.variables.sql;

		let results: any = await self.pool.query(self.variables.sql);
		self.resetResult();

		self.response = {
			rows: results,
			fields: null,
			result: true,
			insertId: results.insertId || null,
			changedRows: results.changedRows || 0,
			affectedRows: results.affectedRows || 0
		};

		if (callback) {
			callback(self.response.result, self.response, null);
		}

		return [self.response.result, self.response, null];
	}

	public async select(
		callback?: Callback,
		params: { fields?: string[]; ResultCheckBy?: Comparison } = {}
	): Promise<[boolean, Response, QueryError | null]> {
		const self = this;

		let sql = ` 
		    SELECT ${(params.fields || ["*"]).join(",")} FROM ${self.variables.table} 
	        ${self.joins}  ${self.wheres}  ${self.groups}  ${self.orders}  ${
			self.limits
		}
	    `;

		try {
			let [result, response, error] = await self.exec(sql);

			response.result = self.compare(
				response.rows.length,
				params.ResultCheckBy || ">",
				0
			);

			if (typeof callback === "function") {
				callback(response.result, response, error);
			}

			return [response.result, response, error];
		} catch (e) {
			throw e;
		}
	}

	public async distinct(
		callback?: Callback,
		params: { fields?: string[]; ResultCheckBy?: Comparison } = {}
	): Promise<[boolean, Response, QueryError | null]> {
		const self = this;

		let sql = ` 
		    SELECT DISTINCT ${(params.fields || ["*"]).join(",")} FROM ${
			self.variables.table
		} 
	        ${self.joins}  ${self.wheres}  ${self.groups}  ${self.orders}  ${
			self.limits
		}
	    `;

		try {
			let [result, response, error] = await self.exec(sql);

			response.result = self.compare(
				response.rows.length,
				params.ResultCheckBy || ">",
				0
			);

			if (typeof callback === "function") {
				callback(response.result, response, error);
			}

			return [response.result, response, error];
		} catch (e) {
			throw e;
		}
	}

	public async update(
		update: { [s: string]: string | number | null },
		callback?: Callback,
		params: { ResultCheckBy?: Comparison; escapeValues?: boolean } = {},
		safeMode: boolean = true
	) {
		const self = this;
		const fields = await self.table_fields;

		if (safeMode && self.wheres.length === 0) {
			throw new Error(
				"Durinn - SAFE MODE - There isn't a where condition in UPDATE query"
			);
		}

		let set = [];

		for (let i in update) {
			if (fields.indexOf(i) > -1) {
				set.push(
					`${self.escapeId(i)} = ${self.escape(
						update[i],
						params.escapeValues
					)}`
				);
			}
		}

		let sql = `
	        UPDATE ${self.variables.table} SET ${set.join(",")} ${self.wheres} 
	    `;

		try {
			let [result, response, error] = await self.exec(sql);

			response.result = self.compare(
				response.changedRows,
				params.ResultCheckBy || ">=",
				0
			);

			if (typeof callback === "function") {
				callback(response.result, response, error);
			}

			return [response.result, response, error];
		} catch (e) {
			throw e;
		}
	}

	public async insert(
		insert: { [s: string]: string | number | null },
		callback?: Callback,
		params: { escapeValues?: boolean } = {}
	) {
		const self = this;
		const fields = await self.table_fields;

		let keys: string[] = [];
		let values: string[] = [];

		for (let i in insert) {
			if (fields.indexOf(i) > -1) {
				keys.push(self.escapeId(i));
				values.push(self.escape(insert[i], params.escapeValues));
			}
		}

		let sql = `
	        INSERT INTO ${self.variables.table} (${keys.join(",")}) 
	        VALUES (${values.join(",")})
	    `;

		try {
			let [result, response, error] = await self.exec(sql);

			response.result = response.insertId != 0;

			if (typeof callback === "function") {
				callback(response.result, response, error);
			}

			return [response.result, response, error];
		} catch (e) {
			throw e;
		}
	}

	public async replace(
		insert: { [s: string]: string | number | null },
		callback?: Callback,
		params: { escapeValues?: boolean } = {}
	) {
		const self = this;
		const fields = await self.table_fields;

		let keys: string[] = [];
		let values: string[] = [];

		for (let i in insert) {
			if (fields.indexOf(i) > -1) {
				keys.push(self.escapeId(i));
				values.push(self.escape(insert[i], params.escapeValues));
			}
		}

		let sql = `
	        REPLACE INTO ${self.variables.table} (${keys.join(",")}) 
	        VALUES (${values.join(",")})
	    `;

		try {
			let [result, response, error] = await self.exec(sql);

			response.result = response.insertId != 0;

			if (typeof callback === "function") {
				callback(response.result, response, error);
			}

			return [response.result, response, error];
		} catch (e) {
			throw e;
		}
	}

	public async delete(
		callback?: Callback,
		params: { ResultCheckBy?: Comparison } = {},
		safeMode: boolean = true
	) {
		const self = this;

		if (safeMode && self.wheres.length === 0) {
			throw new Error(
				"Durinn - SAFE MODE - There isn't a where condition in DELETE query"
			);
		}

		let sql = `
	        DELETE FROM ${self.variables.table} ${self.wheres} 
	    `;

		try {
			let [result, response, error] = await self.exec(sql);

			response.result = self.compare(
				response.affectedRows,
				params.ResultCheckBy || ">",
				0
			);

			if (typeof callback === "function") {
				callback(response.result, response, error);
			}

			return [response.result, response, error];
		} catch (e) {
			throw e;
		}
	}

	private resetResult() {
		this.response = {
			rows: [],
			fields: null,
			result: false,
			insertId: null,
			changedRows: 0,
			affectedRows: 0
		};
	}

	private resetVariables() {
		this.variables = {
			sql: "",
			joins: [],
			table: "",
			conditions: {
				limit: [],
				wheres: [],
				orders: [],
				groups: []
			}
		};
	}

	private get joins(): string {
		const self = this;

		let result: string[] = [];
		let joins: Joins = this.variables.joins;

		if (joins.length === 0) return "";

		for (let key in joins) {
			let join = joins[key];
			let relations = [];

			for (let i in join.on) {
				let relation = join.on[i];
				relations.push(relation.from + " = " + relation.to);
			}

			result.push(
				`${join.type} JOIN ${join.table} ON ${relations.join(" AND ")}`
			);
		}

		return result.join("\n");
	}

	private get wheres(): string {
		const self = this;

		let result: string[] = [];
		let wheres: Wheres = self.variables.conditions.wheres;

		if (wheres.length === 0) return "";

		for (let key in wheres) {
			let where = wheres[key];
			let value = where.escape ? self.escape(where.value) : where.value;

			result.push(`${where.field} ${where.operator} ${value}`);
		}

		return ` WHERE ${result.join(" AND ")} `;
	}

	private get groups(): string {
		const self = this;

		let result: string[] = [];
		let groups: Groups = self.variables.conditions.groups;

		if (groups.length === 0) return "";

		for (let key in groups) {
			result.push(groups[key]);
		}

		return ` GROUP BY ${result.join(",")} `;
	}

	private get orders(): string {
		const self = this;

		let result: string[] = [];
		let orders: Orders = self.variables.conditions.orders;

		if (orders.length === 0) return "";

		for (let key in orders) {
			let order = orders[key];

			result.push(`${order.field} ${order.order}`);
		}

		return ` ORDER BY ${result.join(",")} `;
	}

	private get limits(): string {
		if (this.variables.conditions.limit.length == 0) return "";

		return ` LIMIT ${this.variables.conditions.limit.join(",")} `;
	}

	private compare(
		variable: number,
		operator: string,
		value: number
	): boolean {
		switch (operator) {
			case ">":
				return variable > value;
			case "<":
				return variable < value;
			case ">=":
				return variable >= value;
			case "<=":
				return variable <= value;
			case "==":
				return variable == value;
			case "!=":
				return variable != value;
			case "===":
				return variable === value;
			case "!==":
				return variable !== value;
			default:
				return false;
		}
	}
}
