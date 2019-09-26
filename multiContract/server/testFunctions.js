/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require('node-stringbuilder');
const sb = new StringBuilder();
const network = require('./network');
// const stock = require('./stock_network');
// const rawmaterials = require('./rawmaterials_network');
// const orders = require('./orders_network');
// const tests = require('./tests_network');

const rawMaterial =
{
  batchId: '1014',
  docType: 'materials',
  certified: 'Maybe',
  supplierId: '0001',
  quantity: 1000,
  qtyUnitMeasurement: 'Kg',
  product: 'Organically Salmony',
  dateReceived: '2019-07-07'
};

const newStock = 
  {
    stockId: '114',
    docType: 'stockLevel',
    sourceBatchId: 1122,
    supplierId: '0001',
    sourceBatchQuantity: 112,
    qtyUnitMeasurement: 'Kg',
    dateProcessed: '2019-09-08',
    testResultId: '20190910',
  };

const newOrder = 
  {
    orderId: '1014',
    docType: 'foodOrder',
    despatchDate: '2019-09-20',
    dateReceived: '2019-09-20',
    buyerId: '002',
    quantity: 752,
    qtyUnitMeasurement: 'Kg',
    processUsed: 'Smoking Hot',
    orderLines: [
      { orderLine: 1, sourceBatchId: '1011', tested: 'Yes', quantity: 500, qtyUnitMeasurement: 'Kg' },
      { orderLine: 2, sourceBatchId: '1021', tested: 'Yes', quantity: 250, qtyUnitMeasurement: 'Kg' },
    ],
  }; 

const testResults = 
  {
    testResultId: 'T114',
    docType: 'testResult',
    client: 'Shanagarry',
    typeOfTest: 'really good stuffing',
    result: '123'
  }; 



//Arbitrary object used to store a generic ID for search purposes

/** Check for Existence */
network.keyExists('stock', 'stockExists', newStock.stockId);

// network.keyExists('rawmaterials', 'rawmaterialExists', rawMaterial.batchId);

// network.keyExists('orders', 'orderExists', newOrder.orderId);

// network.keyExists('ProductTests', 'productTestsExists', testResults.testResultId);

/** Create new Blocks */
// network.createKeyValue('rawmaterials', 'createRawmaterial', rawMaterial.batchId, JSON.stringify(rawMaterial));

// network.createKeyValue('stock', 'createStock', newStock.stockId, JSON.stringify(newStock));

// network.createKeyValue('orders', 'createOrder', newOrder.orderId, JSON.stringify(newOrder));

// network.createKeyValue('ProductTests', 'createProductTests', testResults.testResultId, JSON.stringify(testResults));

/** Read Blocks */

// network.readKeyValue('rawmaterials', 'readRawmaterial', rawMaterial.batchId);

// network.readKeyValue('stock', 'readStock', newStock.stockId);

// network.readKeyValue('orders', 'readOrder', newOrder.orderId);

// network.readKeyValue('ProductTests', 'readProductTests', testResults.testResultId);

/** Update Blocks */

// network.updateKeyValue('rawmaterials', 'updateRawmaterial', rawMaterial.batchId, JSON.stringify(rawMaterial));

// network.updateKeyValue('stock', 'updateStock', newStock.stockId, JSON.stringify(newStock));

// network.updateKeyValue('orders', 'updateOrder', newOrder.orderId, JSON.stringify(newOrder));

// network.updateKeyValue('ProductTests', 'updateProductTests', testResults.testResultId, JSON.stringify(testResults));

/** Delete Blocks */

// network.deleteKeyValue('rawmaterials', 'deleteRawmaterial', rawMaterial.batchId);

// network.deleteKeyValue('stock', 'deleteStock', newStock.stockId);

// network.deleteKeyValue('orders', 'deleteOrder', newOrder.orderId);

// network.deleteKeyValue('ProductTests', 'deleteProductTests', testResults.testResultId);


/** Get History */

const getHistory = async (contractName, func, keyID) => {

  const res = await network.getHistoryForKey(contractName, func, keyID);

  let allResults = "";
  const js = JSON.parse(res);
  //Convert the array of ASCII values into a character string
  js.data.toString().split(',').forEach((s) => (sb.append(String.fromCharCode(parseInt(s, 10)))));
  //Parse the string back into a JSON object
  const myJson = JSON.parse(sb.toString());

  //Now all items in the history object array can be accessed
  for (var myKey in myJson) {
    console.log("--------------------------------------------------------------------");
    console.log(myJson[myKey].Value);
    const dt = new Date(parseInt(myJson[myKey].Timestamp.seconds.low) * 1000);
    // console.log(myJson[myKey].Timestamp.seconds.low);
    console.log(dt.toISOString());

    console.log("--------------------------------------------------------------------");

  }

}

// getHistory('rawmaterials', 'getHistoryForKey', rawMaterial.batchId);

// getHistory('stock', 'getHistoryForKey', newStock.stockId);

// getHistory('orders', 'getHistoryForKey', newOrder.orderId);

// getHistory('ProductTests', 'getHistoryForKey', testResults.testResultId);

