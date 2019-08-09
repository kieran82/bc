/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require('node-stringbuilder');

const network = require('./network');
const stock = require('./stock_network');
const rawmaterials = require('./rawmaterials_network');
const orders = require('./orders_network');
const tests = require('./tests_network');

//Arbitrary object used to store a generic ID for search purposes
const batchContract = 
  {
    batchId: '1003'
  };

const stockContract =
{
  batchId: '101'
};  

const orderContract = {
  orderId: '1005'
};

const testIn =
{
  testResultId: 'T103',
  docType: 'testResult',
  client: 'Shanagarry',
  stockId: '1335',
  result: 'Safe'
};

const rawmaterialsTest = async () => {
  const sb = new StringBuilder();
  const res = await rawmaterials.getHistoryForKey(batchContract.batchId);
// rawmaterials.getHistoryForKey("1003");

  let allResults = "";
  const js = JSON.parse(res);
  //Convert the array of ASCII values into a character string
  js.data.toString().split(',').forEach((s) => (sb.append(String.fromCharCode(parseInt(s, 10))))); 
  //Parse the string back into a JSON object
  const myJson = JSON.parse(sb.toString());
  console.log(" ");
  console.log("--------------------------------------------------------------------");
  

  //Now all items in the history object array can be accessed
  for (var myKey in myJson) {
    console.log(myJson[myKey].Value);
    const dt = new Date(parseInt(myJson[myKey].Timestamp.seconds.low) * 1000);
    console.log(myJson[myKey].Timestamp.seconds.low);
    console.log(dt.toISOString());

    console.log("--------------------------------------------------------------------");

  }

}

const stockTest = async () => {
  const sb = new StringBuilder();
  const res = await stock.getHistoryForKey(stockContract.batchId);

  let allResults = "";
  const js = JSON.parse(res);
  js.data.toString().split(',').forEach((s) => (sb.append(String.fromCharCode(parseInt(s, 10)))));
  const myJson = JSON.parse(sb.toString());
  // console.log(myJson);
  console.log("--------------------------------------------------------------------");


  //Now all items in the history object array can be accessed
  for (var myKey in myJson) {
    // console.log(myKey);
    console.log(myJson[myKey].TxId);
    const dt = new Date(parseInt(myJson[myKey].Timestamp.seconds.low) * 1000);
    console.log(myJson[myKey].Value);
    console.log(`Date: ${dt.toISOString()} ${myJson[myKey].Timestamp.nanos}`);

    console.log("--------------------------------------------------------------------");

  }

} 

const testTest = async () => {
  const sb = new StringBuilder();
  const res = await tests.getHistoryForKey(testIn.testResultId);

  let allResults = "";
  const js = JSON.parse(res);
  js.data.toString().split(',').forEach((s) => (sb.append(String.fromCharCode(parseInt(s, 10)))));
  const myJson = JSON.parse(sb.toString());
  console.log(myJson);
  console.log("--------------------------------------------------------------------");


  //Now all items in the history object array can be accessed
  for (var myKey in myJson) {
    // console.log(myKey);
    console.log(myJson[myKey].TxId);
    const dt = new Date(parseInt(myJson[myKey].Timestamp.seconds.low) * 1000);
    console.log(myJson[myKey].Value);
    console.log(`Date: ${dt.toISOString()} ${myJson[myKey].Timestamp.nanos}`);

    console.log("--------------------------------------------------------------------");

  }

} 

const orderTest = async () => {
  const sb = new StringBuilder();
  const res = await orders.getHistoryForKey(orderContract.orderId);

  let allResults = "";
  const js = JSON.parse(res);
  js.data.toString().split(',').forEach((s) => (sb.append(String.fromCharCode(parseInt(s, 10)))));
  const myJson = JSON.parse(sb.toString());
  console.log(myJson);
  console.log("--------------------------------------------------------------------");


  //Now all items in the history object array can be accessed
  for (var myKey in myJson) {
    // console.log(myKey);
    console.log(myJson[myKey].TxId);
    const dt = new Date(parseInt(myJson[myKey].Timestamp.seconds.low) * 1000);
    console.log(myJson[myKey].Value);
    console.log(`Date: ${dt.toISOString()} ${myJson[myKey].Timestamp.nanos}`);

    console.log("--------------------------------------------------------------------");

  }

} 

// orderTest();

// rawmaterialsTest();
stockTest();
// stock.readStock("104");

// network.batchExists("1001")  ;

// rawmaterials.rawMaterialExists("1003");



// network.createBatch(batchContract.batchId, JSON.stringify(batchContract));

// network.updateBatch(batchContract.batchId, JSON.stringify(batchContract));

// network.readBatch(batchContract.batchId);

// network.deleteBatch(batchContract.batchId);