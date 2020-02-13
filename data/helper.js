'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require('node-stringbuilder');

// Create the object template
const mainObject = () => {
  const obj = {
    company: 'GLN of Errigal',
    exportNo: '200001',
    deliveryNo: '30001',
    orderNo: 'MS100007',
    despatchDate: '2019-11-25',
    deliveryDate: '2019-11-26',
    warehouse: {},
    customer: {},
    address: {},
    transport: {},
    lines: []
  };
  return obj;
};

const warehouse = () => {
  const obj = {
    gln: null,
    code: '01',
    name: 'Errigal Bay - Kilmore',
    address: 'Kilmore Quay',
    town: null,
    zip: null,
    county: 'Co Wexford',
    country: 'Ireland'
  };

  return obj;
};

const customer = () => {
  const obj = {
    gln: null,
    code: 'L01',
    name: 'Lidl',
    adddress: 'Rotelstr. 30',
    town: 'Neckarsulm',
    zip: '74166',
    county: null,
    country: 'Germany'
  };

  return obj;
};

const transport = () => {
  const obj = {
    gln: null,
    code: 'DHL',
    description: 'DHL Express'
  };

  return obj;
};

const address = () => {
  const obj = {
    gln: null,
    code: 'L01a',
    name: 'Lidl Distributionszentrum',
    adddress: 'Lange Str. 28',
    town: 'Berlin',
    zip: '10115',
    county: null,
    country: 'Germany'
  };
};

const orderLine = () => {
  const obj = {
    lineId: 12567,
    productBarcode: '802270011054',
    caseBarcode: '8022700130515',
    commodityCode: '03062400',
    customerProductCode: 'C001',
    species: 'CRE',
    weight: 500,
    intakes: []
  };

  return obj;
};

const orderIntake = () => {
  const obj = {
    intakeNo: '21665',
    intakeDate: '2019-11-12',
    supplier: {}
  };

  return obj;
};

const supplier = () => {
  const obj = {
    gln: null,
    code: 'F01',
    name: 'Fisher & Sons Fisheries',
    adddress: 'The Pier',
    town: 'Killala',
    zip: null,
    county: 'Co Mayo',
    country: 'Ireland'
  };
};

exports.orderIntake = orderIntake;
exports.orderLine = orderLine;
exports.mainObject = mainObject;
exports.warehouse = warehouse;
exports.supplier = supplier;
exports.transport = transport;
exports.customer = customer;
exports.adddress = address;
