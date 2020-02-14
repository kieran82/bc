'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require('node-stringbuilder');
const factory = require('./utils/factory');
const helper = require('./utils/helper');
const log = require('./logger');
const Transport = require('./classes/transport');
const Order = require('./classes/order');
const orderService = require('./service/order');

let mainObject = factory.mainObject;
const objArray = [];

const main = () => {
  // Build a JSON object
  const order = helper.buildNewOrder();
  const json = JSON.stringify(order);
  // console.log(json);
  orderService.createOrders();
  // console.log(helper.getFormattedDate('2020-01-01'));
};

main();
