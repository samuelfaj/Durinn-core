"use strict";
var __awaiter =
	(this && this.__awaiter) ||
	function(thisArg, _arguments, P, generator) {
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: new P(function(resolve) {
						resolve(result.value);
					  }).then(fulfilled, rejected);
			}
			step(
				(generator = generator.apply(thisArg, _arguments || [])).next()
			);
		});
	};
var __importDefault =
	(this && this.__importDefault) ||
	function(mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
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
const durinn_1 = __importDefault(require("../durinn"));
class default_1 {
	constructor(table) {
		this.connection = "destroy";
		this.pool = durinn_1.default.database.connection;
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
	reset() {
		this.resetResult();
		this.resetVariables();
	}
	table(name) {
		this.variables.table = name;
		return this;
	}
	escape(value, escape = true) {
		if (escape === false) return value;
		if (value === null) return "null";
		return this.pool.escape(value);
	}
	where(field, operator, value, escape = true) {
		this.variables.conditions.wheres.push({
			field: field.toString(),
			operator: operator,
			value: value.toString(),
			escape: escape
		});
		return this;
	}
	orderBy(field, order = "ASC") {
		this.variables.conditions.orders.push({ field: field, order: order });
		return this;
	}
	groupBy(field) {
		this.variables.conditions.groups.push(field);
		return this;
	}
	join(table, on, to, type = "INNER") {
		let join = { table: table, on: [], type: type };
		if (typeof on === "object") {
			join.on = on;
		}
		if (typeof on === "string" && typeof to === "string") {
			join.on = [{ from: on, to: to }];
		}
		this.variables.joins.push(join);
		return this;
	}
	limit(records, offset) {
		if (typeof offset === "number") {
			this.variables.conditions.limit = [records, offset];
		} else {
			this.variables.conditions.limit = [records];
		}
		return this;
	}
	get rows() {
		return this.response.rows;
	}
	get fields() {
		return this.response.fields;
	}
	get result() {
		return this.response.result;
	}
	get insertId() {
		return this.response.insertId;
	}
	get changedRows() {
		return this.response.changedRows;
	}
	get affectedRows() {
		return this.response.affectedRows;
	}
	exec(sql, callback) {
		return __awaiter(this, void 0, void 0, function*() {
			const self = this;
			self.variables.sql = sql || self.variables.sql;
			return new Promise(resolve => {
				self.pool.getConnection(function(err, connection) {
					if (err) throw err;
					connection.query(self.variables.sql, function(
						error,
						results,
						fields
					) {
						if (self.connection === "destroy") {
							connection.destroy();
						} else {
							connection.release();
						}
						self.resetResult();
						if (error) {
							throw error;
						} else {
							self.response = {
								rows: results,
								fields: fields || null,
								result: true,
								insertId: results.insertId || null,
								changedRows: results.changedRows || 0,
								affectedRows: results.affectedRows || 0
							};
						}
						if (callback) {
							callback(
								self.response.result,
								self.response,
								error
							);
						}
						return resolve([
							self.response.result,
							self.response,
							error
						]);
					});
				});
			});
		});
	}
	select(callback, params = {}) {
		return __awaiter(this, void 0, void 0, function*() {
			const self = this;
			let sql = ` 
		    SELECT ${(params.fields || ["*"]).join(",")} FROM ${self.variables.table} 
	        ${self.joins}  ${self.wheres}  ${self.groups}  ${self.orders}  ${
	self.limits
}
	    `;
			let [result, response, error] = yield self.exec(sql);
			response.result = self.compare(
				response.rows.length,
				params.ResultCheckBy || ">",
				0
			);
			if (typeof callback === "function") {
				callback(response.result, response, error);
			}
			return [response.result, response, error];
		});
	}
	update(update, callback, params = {}, safeMode = true) {
		return __awaiter(this, void 0, void 0, function*() {
			const self = this;
			if (safeMode && self.wheres.length === 0) {
				throw new Error(
					"Durinn - SAFE MODE - There isn't a where condition in UPDATE query"
				);
			}
			let set = [];
			for (let i in update) {
				set.push(
					`${i} = ${self.escape(update[i], params.escapeValues)}`
				);
			}
			let sql = `
	        UPDATE ${self.variables.table} SET ${set.join(",")} ${self.wheres} 
	    `;
			let [result, response, error] = yield self.exec(sql);
			response.result = self.compare(
				response.changedRows,
				params.ResultCheckBy || ">=",
				0
			);
			if (typeof callback === "function") {
				callback(response.result, response, error);
			}
			return [response.result, response, error];
		});
	}
	insert(insert, callback, params = {}) {
		return __awaiter(this, void 0, void 0, function*() {
			const self = this;
			let keys = [];
			let values = [];
			for (let i in insert) {
				keys.push(i);
				values.push(self.escape(insert[i], params.escapeValues));
			}
			let sql = `
	        INSERT INTO ${self.variables.table} (${keys.join(",")}) 
	        VALUES (${values.join(",")})
	    `;
			let [result, response, error] = yield self.exec(sql);
			response.result = response.insertId != 0;
			if (typeof callback === "function") {
				callback(response.result, response, error);
			}
			return [response.result, response, error];
		});
	}
	replace(insert, callback, params = {}) {
		return __awaiter(this, void 0, void 0, function*() {
			const self = this;
			let keys = [];
			let values = [];
			for (let i in insert) {
				keys.push(i);
				values.push(self.escape(insert[i], params.escapeValues));
			}
			let sql = `
	        REPLACE INTO ${self.variables.table} (${keys.join(",")}) 
	        VALUES (${values.join(",")}) ${self.wheres}
	    `;
			let [result, response, error] = yield self.exec(sql);
			response.result = response.insertId != 0;
			if (typeof callback === "function") {
				callback(response.result, response, error);
			}
			return [response.result, response, error];
		});
	}
	delete(callback, params = {}, safeMode = true) {
		return __awaiter(this, void 0, void 0, function*() {
			const self = this;
			if (safeMode && self.wheres.length === 0) {
				throw new Error(
					"Durinn - SAFE MODE - There isn't a where condition in DELETE query"
				);
			}
			let sql = `
	        DELETE FROM ${self.variables.table} ${self.wheres} 
	    `;
			let [result, response, error] = yield self.exec(sql);
			response.result = self.compare(
				response.affectedRows,
				params.ResultCheckBy || ">",
				0
			);
			if (typeof callback === "function") {
				callback(response.result, response, error);
			}
			return [response.result, response, error];
		});
	}
	resetResult() {
		this.response = {
			rows: [],
			fields: null,
			result: false,
			insertId: null,
			changedRows: 0,
			affectedRows: 0
		};
	}
	resetVariables() {
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
	get joins() {
		const self = this;
		let result = [];
		let joins = this.variables.joins;
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
	get wheres() {
		const self = this;
		let result = [];
		let wheres = self.variables.conditions.wheres;
		if (wheres.length === 0) return "";
		for (let key in wheres) {
			let where = wheres[key];
			let value = where.escape ? self.escape(where.value) : where.value;
			result.push(`${where.field} ${where.operator} ${value}`);
		}
		return ` WHERE ${result.join(" AND ")} `;
	}
	get groups() {
		const self = this;
		let result = [];
		let groups = self.variables.conditions.groups;
		if (groups.length === 0) return "";
		for (let key in groups) {
			result.push(self.escape(groups[key]));
		}
		return ` GROUP BY ${result.join(",")} `;
	}
	get orders() {
		const self = this;
		let result = [];
		let orders = self.variables.conditions.orders;
		if (orders.length === 0) return "";
		for (let key in orders) {
			let order = orders[key];
			result.push(`${order.field} ${order.order}`);
		}
		return ` ORDER BY ${result.join(",")} `;
	}
	get limits() {
		if (this.variables.conditions.limit.length == 0) return "";
		return ` LIMIT ${this.variables.conditions.limit.join(",")} `;
	}
	compare(variable, operator, value) {
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
exports.default = default_1;
