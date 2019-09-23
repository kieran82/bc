/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require('node-stringbuilder');
const network = require('./network');

const sb = new StringBuilder();

const stockIn = 
  {
  stockId: '104',
  docType: 'stockLevel',
  sourcestockId: 1001,
  supplierId: '0001',
  addedNewField: 'Stock Record 104 updated',
  sourceBatchQuantity: 186,
  qtyUnitMeasurement: 'Kg',
  dateProcessed: '2019-09-18',
  testResultId: '20190918',
  };

// const testIn =
// {
//   testResultId: 'T103',
//   docType: 'testResult',
//   client: 'Shanagarrydo',
//   typeOfTest: 'micro',
//   result: '12345'
// };


const testy = async () => {

  const res = await network.getHistoryForKey(stockIn.stockId);

  let allResults = "";
  const js = JSON.parse(res);
  //Convert the array of ASCII values into a character string
  js.data.toString().split(',').forEach((s) => (sb.append(String.fromCharCode(parseInt(s, 10))))); 
  //Parse the string back into a JSON object
  const myJson = JSON.parse(sb.toString());

  //Now all items in the history object array can be accessed
  for (var myKey in myJson) {
    console.log(myJson[myKey].Value);
    const dt = new Date(parseInt(myJson[myKey].Timestamp.seconds.low) * 1000);
    // console.log(myJson[myKey].Timestamp.seconds.low);
    console.log(dt.toISOString());

    console.log("--------------------------------------------------------------------");

  }

}

const testytesty = async () => {

  const res = await network.getHistoryForKey(testIn.testResultId);

  let allResults = "";
  const js = JSON.parse(res);
  //Convert the array of ASCII values into a character string
  js.data.toString().split(',').forEach((s) => (sb.append(String.fromCharCode(parseInt(s, 10)))));
  //Parse the string back into a JSON object
  const myJson = JSON.parse(sb.toString());

  //Now all items in the history object array can be accessed
  for (var myKey in myJson) {
    console.log(myJson[myKey].Value);
    const dt = new Date(parseInt(myJson[myKey].Timestamp.seconds.low) * 1000);
    // console.log(myJson[myKey].Timestamp.seconds.low);
    console.log(dt.toISOString());

    console.log("--------------------------------------------------------------------");

  }

}

testy();

// network.stockExists(stockIn.stockId)  ;

// network.createStock(stockIn.stockId, JSON.stringify(stockIn));

// network.updateStock(stockIn.stockId, JSON.stringify(stockIn));

// network.readStock(stockIn.stockId);

// network.deleteStock("T103");

// network.updateProductTests(testIn.testResultId, JSON.stringify(testIn));