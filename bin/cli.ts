#!/usr/bin/env node

let fs = require('fs');
const root = __dirname + '/../../../';

console.log("Initializing Durinn...");

if (!fs.existsSync(root + 'durinn.config.json')) {
    let Config = require('../durinn.config');

    fs.writeFileSync(root + 'durinn.config.json', JSON.stringify(Config, null, 2));
    console.log(" - Durinn configuration file wrote.");
}