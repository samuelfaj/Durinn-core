"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function(mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
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
Object.defineProperty(exports, "__esModule", { value: true });
const durinn_1 = __importDefault(require("../durinn"));
const MySQL = __importStar(require("mysql"));
class default_1 {
	static get connection() {
		return durinn_1.default.pool;
	}
	static get object() {
		return MySQL;
	}
}
exports.default = default_1;
