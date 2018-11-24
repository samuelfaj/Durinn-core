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
const relational_object_1 = __importDefault(require("./relational-object"));
const validFilter = function(sonFilter) {
	for (let item in sonFilter) {
		if (typeof sonFilter[item] === "undefined") return false;
	}
	return true;
};
const buildFilter = function(filter) {
	let response = {};
	for (let item in filter) {
		if (typeof filter[item] !== "undefined") {
			response[item] = filter[item];
		}
	}
	return response;
};
const childFilter = function(filter) {
	let response = {};
	for (let item in filter) {
		if (typeof filter[item] === "undefined") {
			response[item] = filter[item];
		}
	}
	return response;
};
class RelationalGroup extends relational_object_1.default {
	constructor(table, args, _filter) {
		super(table, buildFilter(_filter));
		this.table = table;
		this.args = args;
		this._filter = _filter;
	}
	get(wheres, limit) {
		const _super = name => super[name];
		return __awaiter(this, void 0, void 0, function*() {
			const self = this;
			if (validFilter(self._filter)) {
				return _super("get").call(this);
			}
			const query = this.query;
			if (typeof wheres !== "undefined") {
				for (const item of wheres) {
					query.where(item[0], item[1], item[2]);
				}
			}
			const result = [];
			for (let i in self.joins) {
				let args = Array.prototype.slice.call(self.joins[i]);
				query.join(args[0], args[1], args[2], args[3]);
			}
			if (limit) {
				query.limit(limit[0], limit[1]);
			}
			yield query.select(undefined, {
				fields: Object.keys(childFilter(self._filter))
			});
			for (const item of query.rows) {
				let args = Array.prototype.slice.call(self.args);
				for (let key in item) {
					args.push(item[key]);
				}
				result.push(new self.constructor(...args));
			}
			return result;
		});
	}
	getAllData(wheres, limit) {
		return __awaiter(this, void 0, void 0, function*() {
			const response = yield this.get(wheres, limit);
			if (response.constructor !== Array) {
				return response;
			}
			let array = [];
			for (let i in response) {
				array.push(response[i].get());
			}
			return Promise.all(array);
		});
	}
}
exports.default = RelationalGroup;
