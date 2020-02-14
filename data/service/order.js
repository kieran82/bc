'use strict';

const fs = require('fs');
const path = require('path');
const helper = require('../utils/helper');

const configPath = path.join(process.cwd(), './config.json');

const configJSON = fs.readFileSync(configPath, 'utf8');
const configSettings = JSON.parse(configJSON);

const companies = configSettings.companies;
let gln = configSettings.gln;
let orderNo = configSettings.orderNo;
let deliveryNo = configSettings.deliverNo;
let exportNo = configSettings.exportNo;
let despatchDate = helper.getFormattedDate('2020-01-01');
let deliverDate = helper.getFormattedDate('2020-01-05');
let lidlAddress = configSettings.LidlAddress;
let customers = configSettings.customers;

const transport = configSettings.transport;
let transportArrayPosition = 0;
const numberOfCustomers = customers.length - 1; // for iterating over the array
let customersArrayPosition = 0;

const createCompanyOrder = company => {
  const order = helper.buildNewOrder();
  order.company = company;
  order.exportNo = --exportNo;
  order.deliveryNo = --deliveryNo;
  order.orderNo =
    company.substring(0, 2).toUpperCase() + (--orderNo).toString();
  order.despatchDate = despatchDate;
  order.deliverDate = deliverDate;

  return order;
};

const createCustomerAddress = company => {
  if (customersArrayPosition > numberOfCustomers) {
    customersArrayPosition = 0;
  }

  return configSettings[customers[customersArrayPosition++] + 'Address'];
};

const createCustomerDestinationAddress = company => {
  if (customersArrayPosition > numberOfCustomers) {
    customersArrayPosition = 0;
  }

  return configSettings[
    customers[customersArrayPosition++] + 'LocationAddress'
  ];
};

const createTransport = order => {
  if (transportArrayPosition > configSettings.transport.length - 1) {
    transportArrayPosition = 0;
  }

  order.transport.gln = --gln;
  // console.log(configSettings.transport[transportArrayPosition]);

  order.transport.code = configSettings.transport[transportArrayPosition];
  order.transport.description =
    configSettings.transportDescription[transportArrayPosition];

  // console.log(configSettings.transportDescription[transportArrayPosition]);

  transportArrayPosition++;

  return order.transport;
};

const createOrderLine = () => {
  const orderLine = helper.createOrderLine(dsd);
};

const createCustomer = company => {};

exports.createOrders = () => {
  // read and use array of company names from the config file
  configSettings.companies.forEach(company => {
    const order = createCompanyOrder(company);

    order.customer = createCustomerAddress(company);
    order.address = createCustomerDestinationAddress(company);
    order.transport = createTransport(order);

    console.log(order);
  });
};
