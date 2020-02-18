'use strict';

const fs = require('fs');
const path = require('path');

const configPath = path.join(process.cwd(), './config.json');
// console.log(configPath);

const configJSON = fs.readFileSync(configPath, 'utf8');
const configSettings = JSON.parse(configJSON);
// console.log(configSettings.customers.length);

exports.configSettings = configSettings;
