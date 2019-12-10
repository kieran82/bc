/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require('node-stringbuilder');
const network = require('./network');
const theContract = 'daly_stock';
const client = 'Daly';

const sb = new StringBuilder();

const stockIn = 
{
  stockId: '124',
  docType: 'saleStock',
  sourceStockId: 2014,
  supplierId: '0001',
  sourceBatchQuantity: 300,
  qtyUnitMeasurement: 'Kg',
  dateProcessed: '2019-11-01',
  testResultId: '20191110',
};

// const testIn =
// {
//   testResultId: 'T103',
//   docType: 'testResult',
//   client: 'Shanagarrydo',
//   typeOfTest: 'micro',
//   result: '12345'
// };

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

const testy = async () => {

  const res = await network.getHistoryForKey(theContract, 'getHistoryForKey', stockIn.stockId);

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

/** Range Queries */

const getRange = async (startId, endId) => {

  const res = await network.getStateByRange(startId, endId); //
  const result = JSON.parse(res);
  // console.log(result);

  // result.Value.split(',').forEach((s) => (sb.append(String.fromCharCode(parseInt(s, 10))))); 
  // const myJson = JSON.parse(sb.toString());

  // Now all items in the history object array can be accessed
  console.log("--------------------------------------------------------------------");
  for (var myKey in result) {
    console.log(result[myKey].Value);

    console.log("--------------------------------------------------------------------");

  }

}

/** 
 * Generic Query
 * 
*/
const getQueryResult = async (query) => {

  const res = await network.getQueryResult(theContract, 'getQueryResult', query); //
  const result = JSON.parse(res);
  // console.log(result);

  // result.Value.split(',').forEach((s) => (sb.append(String.fromCharCode(parseInt(s, 10))))); 
  // const myJson = JSON.parse(sb.toString());

  // Now all items in the history object array can be accessed
  console.log("--------------------------------------------------------------------");
  for (var myKey in result) {
    console.log(result[myKey].Value);

    console.log("--------------------------------------------------------------------");

  }

}

const runQueery = async (query) => {

  const res = await network.runQuery(query); //
  console.log(result);

}

const saveArray = async (contract, func, array) => {
  // console.log(contract);
  // array.forEach((s) => {
  //   s.testResultId = s.stockId;

  // });

  // let strArray = JSON.stringify(array);

  await network.saveArrayInSegments(contract, func, array); //  
}

const objToString = (number) => {
  const obj = {
    stockId: '1004',
    docType: 'saleStock',
    supplierId: '0001',
    sourceBatchQuantity: 300,
    qtyUnitMeasurement: 'Kg',
    dateProcessed: '2019-11-01',
    testResultId: '20190710',
  };

  let curDate = Date.now()
  obj.supplierId = (number + 20057).toString();

  // console.log(JSON.stringify(obj));  
  return obj;

}

const newArray = (start, end) => {
  let arr = [];

  for (let i = start; i <= end; i++) {
    let obj = createStockBatch(i, client);  //  objToString(i);
    arr.push(obj);
  }

  // arr.forEach((s) => {
  //   console.log(s.StockId);
    
  // });

  // console.log(arr[22]);

  return arr;
  
};

const createStockObject = (stockId, client) => {
  // console.log(`Stock ID is ${StockId}`);
  let stockTemplate = 
  {
    stockId: '1004',
    docType: 'saleStock',
    sourceStockId: 2003,
    supplierId: '0002',
    sourceBatchQuantity: 300,
    qtyUnitMeasurement: 'Kg',
    dateProcessed: '2019-12-01',
    testResultId: '20191210',
  };
  
  let stock = {};
  stock = stockTemplate;
  stock.stockId = stockId;
  stock.sourceBatchQuantity = 50
  stock.docType = client + 'Stock';
  stock.testResultId = stockId.toString();
  // console.log(`Stock ID is ${Stock.StockId}`);
  return stock;
}

/**
* Create an array of Stock objects based on a lower and upper limit
* @param {*} firstStockId 
* @param {*} lastStockId 
*/
const createStockBatch = (firstStockId, lastStockId) => {
  let batchArray = [];

  for(let i = firstStockId; i <= lastStockId; i++) {
    batchArray.push(createStockObject(i.toString(), client));
  }  

  // for (let i = 0; i < batchArray.length; i++) {
  //   console.log(`${batchArray[i].DocType} `);   
  // }      

  return batchArray;
}  

/**
* Create and save a batch of Stocks identified by the range of numbers given
* @param {The first number in the StockId range} firstStockId 
* @param {the last number in the StockId range} lastStockId 
*/
const saveStockBatch = async (firstStockId, lastStockId, inIncrements) => {
  let counter = 0;
  //saveArray
  let batchArray = [];
  batchArray = createStockBatch(firstStockId, lastStockId);
  console.log(`batchArray length is ${batchArray.length}`);

  if (inIncrements === true){
      await network.saveArrayOneAtATime(theContract, 'createStock', batchArray);
  }
  else {
    await network.saveArrayInSegments(theContract, 'saveArray', batchArray);
  }

}


// testy();

// network.keyExists(theContract, 'stockExists', stockIn.stockId)

// network.createKeyValue(theContract, 'createStock', stockIn.stockId, JSON.stringify(stockIn));

// network.updateKeyValue(theContract, 'updateStock', stockIn.stockId, JSON.stringify(stockIn));

// network.readKeyValue(theContract, 'readStock', stockIn.stockId);

// network.deleteKeyValue(theContract, 'deleteStock', '103');


// network.getStateByRange(theContract, 'getStateByRange', '101', '104' )


// getRange( '101', '107');

// getHistory(theContract, 'getHistoryForKey', '21003');

// "{\r\n   \"selector\": {\r\n      \"sourceStockId\": {\r\n         \"$gt\": 1000\r\n      },\r\n      \"sourceBatchQuantity\": {\r\n         \"$gt\": 99\r\n      }\r\n   }\r\n}"

// "{\r\n   \"selector\": {\r\n          \"sourceBatchQuantity\": {\r\n         \"$gt\": 499\r\n      }\r\n   }\r\n}"

// const qry = "{\r\n   \"index\": {\r\n      \"fields\": [\r\n         \"supplierId\"\r\n      ]\r\n   },\r\n   \"name\": \"supplierId-json-index\",\r\n   \"type\": \"json\"\r\n}"

// const qry = "{\r\n   \"selector\": \r\n\t{\r\n\t   \"index\": {\r\n\t\t  \"fields\": [\r\n\t\t     \"supplierId\"\r\n\t\t  ]\r\n\t   },\r\n\t   \"name\": \"supplierId-json-index\",\r\n\t   \"type\": \"json\"\r\n\t}\r\n}";

// const qry = "{\r\n    \"_id\": \"05c0c8ee5166bf9a2dfb6cf97e005334\",\r\n  \"language\": \"query\",\r\n  \"views\": {\r\n    \"testResultId-json-index\": {\r\n      \"map\": {\r\n        \"fields\": {\r\n          \"supplierId\": \"asc\"\r\n        },\r\n        \"partial_filter_selector\": {}\r\n      },\r\n      \"reduce\": \"_count\",\r\n      \"options\": {\r\n        \"def\": {\r\n          \"fields\": [\r\n            \"supplierId\"\r\n          ]\r\n        }\r\n      }\r\n    }\r\n  }\r\n}";

// getQueryResult("{\r\n   \"selector\": {\r\n      \"sourceStockId\": {\r\n         \"$gt\": 1000\r\n      },\r\n      \"sourceBatchQuantity\": {\r\n         \"$gt\": 99\r\n      }\r\n   }\r\n}");

// getQueryResult("{\r\n   \"selector\": {\r\n          \"sourceBatchQuantity\": {\r\n         \"$gte\": 100\r\n      }\r\n   }\r\n}");

const qry = '{ \
  "selector": { \
    "stockId": { \
      "$eq": "2998" \
    }\
  }\
}';

const indexQry = '{\
"selector": {\
  "stockId": {\
    "$eq": 2999\
  }\
}\
}';

getQueryResult(qry);

// const arr = newArray(110, 121);
// saveArray(theContract, 'saveArray', arr);

saveStockBatch(5001, 6000, false);



