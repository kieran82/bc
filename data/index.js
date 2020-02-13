'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require('node-stringbuilder');
const factory = require('./utils/factory');
const helper = require('./utils/helper');
const log = require('./logger');
const Transport = require('./classes/transport');
const Order = require('./classes/order');

let mainObject = factory.mainObject;
const objArray = [];

// objArray.push(new Transport());
// objArray.push(new Order());

// const objNameArray = [
//   'transport',
//   'order',
//   'warehouse',
//   'customer',
//   'address',
//   'orderLine',
//   'orderIntake',
//   'supplier'
// ];
// // let transport = new Transport();

// console.log(objArray[0].description);
// const obj1 = factory.NewObject('warehouse');
// const obj2 = factory.NewObject('warehouse');

// // console.log(objArray[objNameArray.indexOf('order')].company);
// // console.log(objArray[objNameArray.indexOf('transport')].description);

// if (obj1 === obj2) {
//   console.log("There're the same");
//   return;
// } else {
//   const orderLine = factory.NewObject('orderLine');
//   console.log(obj1.name);
//   console.log(orderLine);
// }

// console.log('Hello World!');
// console.log(mainObject.toString());

// log.logger.info('Ready');

const main = () => {
  // decide on how many different orders will be created
  // how many order lines will be createdd? Will it vary e.g. rotate between 1 and a configurable number
  // how many intake sources will be used e.g. rotate between a certain number.
  // for (let i = 0; i < 10; i++) {
  //   let transport = factory.Transport;
  //   let order = helper.build();
  //   let warehouse = factory.Warehouse;
  //   let customer = factory.Customer;
  //   let address = factory.Address;
  //   let orderLine = factory.OrderLine;
  //   let orderIntake = factory.OrderIntake;
  //   let supplier = factory.Supplier;
  //   // mainObject.company.transport.gln = `Company ${i}`;
  //   console.log(order.company);
  // }
  // objNameArray.forEach(element => {
  //   console.log(element);
  // });
  // Build a JSON object
  const order = helper.buildNewOrder();
  console.log(order);

  // console.log(order.transport.description);
};

main();
