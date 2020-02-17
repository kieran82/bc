'use strict';

const factory = require('./factory');
const MSPERDAY = 86400;

exports.MSPERDAY = MSPERDAY;

// orderDate.company = 'GLN of Errigal';
// orderDate.exportNo = '200001';
// orderDate.deliveryNo = '30001';
// orderDate.orderNo = 'MS100007';
// orderDate.despatchDate = '2019-11-25';
// orderDate.deliveryDate = '2019-11-26';
// orderDate.warehouse = {};
// orderDate.customer = {};
// orderDate.address = {};
// orderDate.transport = {};
// orderDate.lines = [];

exports.buildNewOrder = () => {
  try {
    const order = factory.NewObject('order');

    order.company = 'New Company';
    order.exportNo = '13232';
    order.deliveryNo = '0000198';
    order.orderNo = 'MS000009876';
    order.despatchDate = '2020-02-04';
    order.deliveryDate = '2020-02-06';
    Object.assign(order.warehouse, factory.NewObject('warehouse'));
    Object.assign(order.customer, factory.NewObject('customer'));
    Object.assign(order.address, factory.NewObject('address'));
    Object.assign(order.transport, factory.NewObject('transport'));

    const orderLine = factory.NewObject('orderLine');

    const orderIntake = factory.NewObject('orderIntake');
    Object.assign(orderIntake.supplier, factory.NewObject('supplier'));

    orderLine.intakes.push(orderIntake);
    orderLine.intakes.push(factory.NewObject('orderIntake'));

    order.lines.push(orderLine);
    // console.log(orderLine);

    order.lines.push(factory.NewObject('orderLine'));

    return order;
  } catch (error) {
    console.log(error);
  }
};

exports.createOrderLine = () => {
  return factory.NewObject('orderLine');
};

exports.createOrderLineIntake = () => {
  return factory.NewObject('orderintake');
};

/***
 * param : startDate is type Date
 *
 * For test data creation, this date represents the landing date. All other dates can be created
 * on either side of this date e.g. catch date will be earlier than landing date, intake date
 * will be greater than or equal to the landing date. A despatch date will be earlier than a
 * proposed delivery date.
 */
exports.createOrderRelatedDates = landingDate => {
  const orderDate = factory.OrderDates; //factory.NewObject('orderDates');

  orderDate.despatchDate = new Date(landingDate.getTime(MSPERDAY * 2));
  orderDate.deliveryDate = new Date(landingDate.getTime(MSPERDAY * 3));
  orderDate.catchDate = new Date(landingDate.getTime(MSPERDAY * 5));
  orderDate.landingDate = landingDate;
  orderDate.intakeDate = new Date(landingDate.getTime(MSPERDAY * 1));

  return orderDate;
};
exports.createSupplier = () => {
  return factory.NewObject('supplier');
};

exports.getFormattedDate = yyyymmdd => {
  try {
    let date = new Date(yyyymmdd);
    let day =
      date.getDate() < 10
        ? '0' + date.getDate().toString()
        : date.getDate().toString();
    const month =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1;
    const year = date.getFullYear();
    return day + '-' + month + '-' + year;
  } catch (error) {
    console.log(error);
  }
};

exports.getFormattedDateToday = () => {
  try {
    let date = new Date();
    let day =
      date.getDate() < 10
        ? '0' + date.getDate().toString()
        : date.getDate().toString();
    const month =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1;
    const year = date.getFullYear();
    return day + '-' + month + '-' + year;
  } catch (error) {
    console.log(error);
  }
};
