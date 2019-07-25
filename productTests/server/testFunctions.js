/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');

const network = require('./network');

const testIn = 
  {
  testResultId: 'T103',
  docType: 'testResult',
  client: 'Shanagarry',
  stockId: '101',
  result: 'Safely does it'
  };

network.productTestsExists(testIn.testResultId)  ;

// network.createProductTests(testIn.testResultId, JSON.stringify(testIn));

// network.updateProductTests(testIn.testResultId, JSON.stringify(testIn));

// network.readProductTests(testIn.testResultId);

// network.deleteProductTests(testIn.testResultId);