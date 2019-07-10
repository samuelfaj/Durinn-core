const fs = require("fs");

let Config = require("./durinn.config");

if (fs.existsSync(process.cwd() + "/durinn.config.json")) {
	Config = require(process.cwd() + "/durinn.config");
} else {
	console.error(
		'Durinn - durin.config.json not found. Please run "durinn init" command.'
	);
}

import Tests from "./classes/tests";
import Query from "./helpers/query";

const mysql = require("serverless-mysql")({
	config: Config.database
});

export default class {
	public static get pool() {
		return mysql;
	}

	public static get config() {
		return Config;
	}

	public static get database() {
		return mysql.getClient();
	}

	public static get tests() {
		return Tests;
	}

	public static get query() {
		return Query;
	}
}
