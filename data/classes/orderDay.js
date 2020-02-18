'use strict';
const configSettings = require('../classes/configSettings').configSettings;

let despatchDaysFromNow = configSettings.despatchDaysFromNow;
let deliveryDaysFromNow = configSettings.deliveryDaysFromNow;
let catchDaysFromNow = configSettings.catchDaysFromNow;
let landingDaysFromNow = configSettings.landingDaysFromNow;
let intakeDaysFromNow = configSettings.intakeDaysFromNow;

module.exports = class OrderDay {
  constructor() {
    this.despatchDaysFromNow = configSettings.despatchDaysFromNow;
    this.deliveryDaysFromNow = configSettings.deliveryDaysFromNow;
    this.catchDaysFromNow = configSettings.catchDaysFromNow;
    this.landingDaysFromNow = configSettings.landingDaysFromNow;
    this.intakeDaysFromNow = configSettings.intakeDaysFromNow;
  }

  static getdespatchDaysFromNow() {
    return despatchDaysFromNow--;
  }

  static getDeliveryDaysFromNow() {
    return deliveryDaysFromNow--;
  }

  static getCatchDaysFromNow() {
    return catchDaysFromNow--;
  }

  static getLandingDaysFromNow() {
    return landingDaysFromNow--;
  }

  static getIntakeDaysFromNow() {
    return intakeDaysFromNow--;
  }
};
