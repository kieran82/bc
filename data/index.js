'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require('node-stringbuilder');
const helper = require('./helper');
const log = require('./logger');
const Transport = require('./classes/transport');
// const myTransport = require('./helper').myTransport;

let mainObject = helper.mainObject;
// let transport = new Transport();

console.log('Hello World!');
console.log(mainObject.toString());

// log.logger.info('Ready');

const main = () => {
  // decide on how many different orders will be created
  // how many order lines will be createdd? Will it vary e.g. rotate between 1 and a configurable number
  // how many intake sources will be used e.g. rotate between a certain number.
  for (let i = 0; i < 10; i++) {
    let mainObject = helper.mainObject;
    let transport = new Transport();
    // mainObject.company.transport.gln = `Company ${i}`;
    console.log(transport.description);
  }
};

main();
