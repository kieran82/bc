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
  sourceBatchId: 1003,
  supplierId: '0001',
  sourceBatchQuantity: 300,
  qtyUnitMeasurement: 'Kg',
  dateProcessed: '2019-10-01',
  testResultId: '20190710',
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

  const res = await network.getQueryResult(query); //
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

// testy();

// network.stockExists(stockIn.stockId)  ;

// network.createStock(stockIn.stockId, JSON.stringify(stockIn));

// network.updateStock(stockIn.stockId, JSON.stringify(stockIn));

// network.readStock(stockIn.stockId);

// network.deleteStock("T103");

// network.updateProductTests(testIn.testResultId, JSON.stringify(testIn));



// getRange( '101', '107');

// "{\r\n   \"selector\": {\r\n      \"sourceBatchId\": {\r\n         \"$gt\": 1000\r\n      },\r\n      \"sourceBatchQuantity\": {\r\n         \"$gt\": 99\r\n      }\r\n   }\r\n}"

// "{\r\n   \"selector\": {\r\n          \"sourceBatchQuantity\": {\r\n         \"$gt\": 499\r\n      }\r\n   }\r\n}"

// const qry = "{\r\n   \"index\": {\r\n      \"fields\": [\r\n         \"supplierId\"\r\n      ]\r\n   },\r\n   \"name\": \"supplierId-json-index\",\r\n   \"type\": \"json\"\r\n}"

// const qry = "{\r\n   \"selector\": \r\n\t{\r\n\t   \"index\": {\r\n\t\t  \"fields\": [\r\n\t\t     \"supplierId\"\r\n\t\t  ]\r\n\t   },\r\n\t   \"name\": \"supplierId-json-index\",\r\n\t   \"type\": \"json\"\r\n\t}\r\n}";

// const qry = "{\r\n    \"_id\": \"05c0c8ee5166bf9a2dfb6cf97e005334\",\r\n  \"language\": \"query\",\r\n  \"views\": {\r\n    \"testResultId-json-index\": {\r\n      \"map\": {\r\n        \"fields\": {\r\n          \"supplierId\": \"asc\"\r\n        },\r\n        \"partial_filter_selector\": {}\r\n      },\r\n      \"reduce\": \"_count\",\r\n      \"options\": {\r\n        \"def\": {\r\n          \"fields\": [\r\n            \"supplierId\"\r\n          ]\r\n        }\r\n      }\r\n    }\r\n  }\r\n}";

// getQueryResult("{\r\n   \"selector\": {\r\n      \"sourceBatchId\": {\r\n         \"$gt\": 1000\r\n      },\r\n      \"sourceBatchQuantity\": {\r\n         \"$gt\": 99\r\n      }\r\n   }\r\n}");

// getQueryResult("{\r\n   \"selector\": {\r\n          \"sourceBatchQuantity\": {\r\n         \"$gte\": 100\r\n      }\r\n   }\r\n}");

const qry = '{ \
  "selector": { \
    "stockId": { \
      "$gt": "2232" \
    }\
  }\
}';

const indexQry = '{\
"selector": {\
  "sourceBatchId": {\
    "$gte": 1\
  }\
}\
}';

getQueryResult(qry);



