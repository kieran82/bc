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
let customers = configSettings.customers;

let transportArrayPosition = 0;
const numberOfCustomers = customers.length - 1; // for iterating over the array
let customersArrayPosition = 0;
let orderLineNumber = 1;
let lineCountPosition = 0;
let intakeCountPosition = 0;
let intakeNumber = configSettings.intakeNumber;

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

const createOrderLines = order => {
  const numberOfLinesToCreate = configSettings.lineCount[lineCountPosition];
  // console.log(`Number of lines to create is ${numberOfLinesToCreate}`);
  order.lines.shift();
  // console.log(order.lines.length);

  let lineCounter = 1;

  while (lineCounter <= numberOfLinesToCreate) {
    const orderLine = helper.createOrderLine();
    orderLine.lineId = lineCounter;
    orderLine.intakes.shift();
    orderLine.intakes = createIntakes();
    lineCounter++;
    order.lines.push(orderLine);
    // console.log(order.lines[lineCounter - 1]);
  }
};

const createCustomer = company => {};

const createIntakes = (order) => {
  //Use the number found in this array to determine how many intake objects are to be created.
  const numberOfIntakes = configSettings.intakeCount[intakeCountPosition];
  const intakes = [];
  let intakeCounter = 1;
  intakeCountPosition++;
  //Reset the position in the array back to zero if posintion value exceedds the length of the array
  if (intakeCountPosition >= configSettings.intakeCount.length ) {
    intakeCountPosition = 0;
  }

  while (intakeCounter <= numberOfIntakes ) {
    let intake = helper.createOrderLineIntake();
    intake.intakeNo = ++intakeNumber;
    intakes.push(intake);
    intakeCounter++;
  }
  // console.log(intakes);
  
  return intakes;

}

exports.createOrders = () => {
  // read and use array of company names from the config file
  configSettings.companies.forEach(company => {
    const order = createCompanyOrder(company);

    order.customer = createCustomerAddress(company);
    order.address = createCustomerDestinationAddress(company);
    order.transport = createTransport(order);
    order.lines.shift();

    if (configSettings.lineCount[lineCountPosition] > 1) {
      //add  some more order lines depending on the number in this position of the array
      createOrderLines(order);
      // console.log(order.lines[1].intakes);
    }

    

    if (lineCountPosition > configSettings.lineCount.length) {
      lineCountPosition = 0;
    } else {
      lineCountPosition++;
    }

    console.log(JSON.stringify(order));
  });
};