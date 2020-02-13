'use strict';

const Transport = require('../classes/transport');
const Order = require('../classes/order');
const Warehouse = require('../classes/warehouse');
const Customer = require('../classes/customer');
const Address = require('../classes/address');
const OrderLine = require('../classes/orderLine');
const OrderIntake = require('../classes/orderIntake');
const Supplier = require('../classes/supplier');

const objNameArray = [
  'transport',
  'order',
  'warehouse',
  'customer',
  'address',
  'orderline',
  'orderintake',
  'supplier'
];
const objArray = [];

objArray.push(Transport);
objArray.push(Order);
objArray.push(Warehouse);
objArray.push(Customer);
objArray.push(Address);
objArray.push(OrderLine);
objArray.push(OrderIntake);
objArray.push(Supplier);

// Create the object template

// exports.Transport = new Transport();
// exports.Order = new Order();
// exports.Warehouse = new Warehouse();
// exports.Customer = new Customer();
// exports.Address = new Address();
// exports.OrderLine = new OrderLine();
// exports.OrderIntake = new OrderIntake();
// exports.Supplier = new Supplier();

exports.NewObject = object => {
  const objectName = object.toString().toLowerCase();
  // console.log(objectName);

  const newObject = objArray[objNameArray.indexOf(objectName)];

  return new newObject();
};
