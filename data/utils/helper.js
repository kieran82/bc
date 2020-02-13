'use strict';

const factory = require('./factory');

// this.company = 'GLN of Errigal';
// this.exportNo = '200001';
// this.deliveryNo = '30001';
// this.orderNo = 'MS100007';
// this.despatchDate = '2019-11-25';
// this.deliveryDate = '2019-11-26';
// this.warehouse = {};
// this.customer = {};
// this.address = {};
// this.transport = {};
// this.lines = [];

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
