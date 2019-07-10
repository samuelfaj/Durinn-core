"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function(mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
let Config = require("./durinn.config");
if (fs.existsSync(process.cwd() + "/durinn.config.json")) {
	Config = require(process.cwd() + "/durinn.config");
} else {
	console.error(
		"Durinn - durin.config.json not found. Please run \"durinn init\" command."
	);
}
const tests_1 = __importDefault(require("./classes/tests"));
const query_1 = __importDefault(require("./helpers/query"));
const mysql = require("serverless-mysql")({
	config: Config.database
});
class default_1 {
	static get pool() {
		return mysql;
	}
	static get config() {
		return Config;
	}
	static get database() {
		return mysql.getClient();
	}
	static get tests() {
		return tests_1.default;
	}
	static get query() {
		return query_1.default;
	}
}
exports.default = default_1;
