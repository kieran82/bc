'use strict';

module.exports = class OrderDates {
  constructor() {
    this.despatchDate = new Date();
    this.deliveryDate = new Date();
    this.catchDate = new Date();
    this.landingDate = new Date();
    this.intakeDate = new Date();
  }
};
