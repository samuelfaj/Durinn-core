"use strict";
var __importStar =
	(this && this.__importStar) ||
	function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null)
			for (var k in mod)
				if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
		result["default"] = mod;
		return result;
	};
var __importDefault =
	(this && this.__importDefault) ||
	function(mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
const MySQL = __importStar(require("mysql"));
const fs = require("fs");
let Config = require("./durinn.config");
if (fs.existsSync(process.cwd() + "/durinn.config.json")) {
	Config = require(process.cwd() + "/durinn.config");
} else {
	console.error(
		"Durinn - durin.config.json not found. Please run \"durinn init\" command."
	);
}
const mysql_1 = __importDefault(require("./classes/mysql"));
const tests_1 = __importDefault(require("./classes/tests"));
const query_1 = __importDefault(require("./helpers/query"));
const Pool = MySQL.createPool(Config.database);
class default_1 {
	static get pool() {
		return Pool;
	}
	static get config() {
		return Config;
	}
	static get database() {
		return mysql_1.default;
	}
	static get tests() {
		return tests_1.default;
	}
	static get query() {
		return query_1.default;
	}
}
exports.default = default_1;
