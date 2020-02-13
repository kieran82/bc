'use strict';

module.exports = class OrderLine {
  constructor() {
    this.lineId = 12567;
    this.productBarcode = '802270011054';
    this.caseBarcode = '8022700130515';
    this.commodityCode = '03062400';
    this.customerProductCode = 'C001';
    this.species = 'CRE';
    this.weight = 500;
    this.intakes = [];
  }
};
