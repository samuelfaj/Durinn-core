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
const durinn_1 = __importDefault(require("./durinn"));
const query_1 = __importDefault(require("./helpers/query"));
class RelationalObject {
	constructor(table, filter) {
		this.table = table;
		this.filter = filter;
		this.last = { query: new query_1.default() };
		this.joins = [];
		this.cache = undefined;
		this.last.query = new durinn_1.default.query(this.table);
	}
	get query() {
		const self = this;
		const query = new durinn_1.default.query(self.table);
		for (let i in self.filter) {
			query.where(i, "=", self.filter[i]);
		}
		return query;
	}
	get data() {
		const self = this;
		return new Promise(resolve => {
			if (self.cache === undefined) {
				self.get().then(result => {
					resolve(result);
				});
			}
			if (self.cache !== undefined) {
				resolve(self.cache);
			}
		});
	}
	get() {
		return __awaiter(this, void 0, void 0, function*() {
			const self = this;
			const query = this.query;
			for (let i in self.joins) {
				let args = Array.prototype.slice.call(self.joins[i]);
				query.join(args[0], args[1], args[2], args[3]);
			}
			yield query.select();
			return (this.cache = query.rows[0] || {});
		});
	}
	insert(fields, insert_filter = true) {
		return __awaiter(this, void 0, void 0, function*() {
			const query = this.query;
			const filter = this.filter;
			if (insert_filter) {
				for (const item in filter) {
					fields[item] = filter[item];
				}
			}
			yield query.insert(fields);
			return query.insertId || false;
		});
	}
	replace(fields, insert_filter = true) {
		return __awaiter(this, void 0, void 0, function*() {
			const query = this.query;
			const filter = this.filter;
			if (insert_filter) {
				for (const item in filter) {
					fields[item] = filter[item];
				}
			}
			yield query.replace(fields);
			return query.result;
		});
	}
	update(field, value) {
		return __awaiter(this, void 0, void 0, function*() {
			const query = this.query;
			if (typeof field === "object") {
				yield query.update(field);
				return query.result;
			}
			if (typeof field === "string" && typeof value !== "undefined") {
				yield query.update({ [field]: value });
				return query.result;
			}
			return false;
		});
	}
	delete() {
		return __awaiter(this, void 0, void 0, function*() {
			const query = this.query;
			yield query.delete();
			return query.result;
		});
	}
	join(table, on, to, type = "INNER") {
		this.joins.push(arguments);
	}
}
exports.default = RelationalObject;
