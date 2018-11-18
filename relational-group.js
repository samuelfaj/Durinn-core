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
class RelationalGroup extends relational_object_1.default {
	constructor(_arguments) {
		super(
			_arguments.table,
			Object.assign(
				_arguments.fatherFilter || _arguments.father.filter,
				validFilter(_arguments.filter) ? _arguments.filter : {}
			)
		);
		this._arguments = _arguments;
		this.table = _arguments.table;
		this.father = _arguments.father;
		this.sonFilter = _arguments.filter;
		this.args = _arguments.args;
		this.fatherFilter = _arguments.fatherFilter;
	}
	get(wheres) {
		const _super = name => super[name];
		return __awaiter(this, void 0, void 0, function*() {
			const self = this;
			if (validFilter(self.sonFilter)) {
				return _super("get").call(this);
			}
			const query = this.query;
			if (typeof wheres !== "undefined") {
				for (const item of wheres) {
					query.where(item[0], item[1], item[2]);
				}
			}
			const result = [];
			yield query.select(undefined, {
				fields: Object.keys(self.sonFilter)
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
	getAllData(wheres) {
		return __awaiter(this, void 0, void 0, function*() {
			const response = yield this.get(wheres);
			let array = [];
			for (let item of response) {
				console.log(yield item.get());
				array.push(item.get());
			}
			return Promise.all(array);
		});
	}
}
exports.default = RelationalGroup;
