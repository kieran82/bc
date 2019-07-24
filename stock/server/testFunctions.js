/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');

const network = require('./network');

const stockIn = 
  {
  stockId: '103',
  docType: 'stockLevel',
  sourcestockId: 1001,
  supplierId: '0001',
  addedNewField: 'Hello There matey',
  sourceBatchQuantity: 100,
  qtyUnitMeasurement: 'Kg',
  dateProcessed: '2019-07-08',
  testResultId: '20190710',
  };

network.stockExists(stockIn.stockId)  ;

// network.createStock(stockIn.stockId, JSON.stringify(stockIn));

// network.updateStock(stockIn.stockId, JSON.stringify(stockIn));

// network.readStock(stockIn.stockId);

// network.deleteStock(stockIn.stockId);