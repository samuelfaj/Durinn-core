#!/usr/bin/env node

let fs = require("fs");

console.log("Initializing Durinn...");

if (!fs.existsSync(process.cwd() + "durinn.config.json")) {
	let Config = require("../durinn.config");

	fs.writeFileSync(
		process.cwd() + "durinn.config.json",
		JSON.stringify(Config, null, 2)
	);
	console.log(" - Durinn configuration file wrote.");
}
