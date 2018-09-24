const root = __dirname + '/../../';
const fs = require('fs');

let Config = require('./durinn.config');

if (fs.existsSync(root + 'durinn.config.json')) {
    Config = require(__dirname + '/../../durinn.config');
}else{
    console.error("Durinn - durin.config.json not found. Please run \"durinn init\" command.");
}

import Mysql from "./classes/mysql";
import Tests from "./classes/tests";
import Query from "./helpers/query";

export default class {
	public static get config() {
		return Config;
	}

	public static get database() {
		return Mysql;
	}

	public static get tests() {
		return Tests;
	}

	public static get query() {
		return Query;
	}
}
