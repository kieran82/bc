'use strict';

module.exports = class Order {
  constructor() {
    this.company = 'GLN of Errigal';
    this.exportNo = '200001';
    this.deliveryNo = '30001';
    this.orderNo = 'MS100007';
    this.despatchDate = '2019-11-25';
    this.deliveryDate = '2019-11-26';
    this.warehouse = {};
    this.customer = {};
    this.address = {};
    this.transport = {};
    this.lines = [];
  }
};
