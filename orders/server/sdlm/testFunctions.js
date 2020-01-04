/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require('node-stringbuilder');
const sb = new StringBuilder();
const theContract = 'orders';


const network = require('./network');

const order = 
  {
    'orderId': '1006',
    'docType': 'foodOrder',
    'despatchDate': '2019-12-20',
    'dateReceived': '2019-12-20',
    'buyerId': '1001',
    'quantity': 555,
    'qtyUnitMeasurement': 'Kg',
    'processUsed': 'Smoking',
    'orderLines': [
      {
      'orderLine': 1, 'sourceorderId': '101', 'tested': 'Yes', 'quantity': 310, 'qtyUnitMeasurement': 'Kg' },
      { 'orderLine': 2, 'sourceorderId': '102', 'tested': 'Yes', 'quantity': 137, 'qtyUnitMeasurement': 'Kg' },
    ],
  };


const createOrders = async (firstOrderId, lastOrderId) => {

  for(let i = firstOrderId; i <= lastOrderId; i++) {
    let order = createOrderObject(i.toString());
    // console.log(`This is the new  ${order.orderId}`);
    await network.createKeyValue(theContract, 'createOrder', i.toString(), JSON.stringify(order));
  }  
} 

const createOrderObject = (orderId) => {
  // console.log(`Order ID is ${orderId}`);
  let orderTemplate = 
  {
    'orderId': '1003',
    'docType': 'foodOrder',
    'despatchDate': '2019-11-20',
    'dateReceived': '2019-11-22',
    'buyerId': '2002',
    'quantity': 750,
    'qtyUnitMeasurement': 'Kg',
    'processUsed': 'Smokin Hot again',
    'orderLines': [
      {
      'orderLine': 1, 'sourceorderId': '201', 'tested': 'Yes', 'quantity': 210, 'qtyUnitMeasurement': 'Kg' },
      { 'orderLine': 2, 'sourceorderId': '202', 'tested': 'Yes', 'quantity': 517, 'qtyUnitMeasurement': 'Kg' },
    ],
  };  
  
  let order = {};
  order = orderTemplate;
  order.orderId = orderId;
  order.quantity = 899
  // console.log(`Order ID is ${order.orderId}`);
  return order;
}
 

/**
 * Create an array of Order objects based on a lower and upper limit
 * @param {*} firstOrderId 
 * @param {*} lastOrderId 
 */
const createOrderBatch = (firstOrderId, lastOrderId) => {
  let batchArray = [];

  for(let i = firstOrderId; i <= lastOrderId; i++) {
    // console.log(`This is the (i)  ${i}`);
    batchArray.push(createOrderObject(i.toString()));
    // console.log(order.orderId);
    
    //Create a JSON object
    // batchArray.push(order);
  }  

  // for (let i = 0; i < batchArray.length; i++) {
  //   console.log(`${batchArray[i].orderId} `);   
  // }      

  return batchArray;
}

/**
 * Create and save a batch of orders identified by the range of numbers given
 * @param {The first number in the OrderId range} firstOrderId 
 * @param {the last number in the OrderId range} lastOrderId 
 */
const saveOrderBatch = async (firstOrderId, lastOrderId) => {
  let counter = 0;
  //saveArray
  let orderArray = [];
  orderArray = createOrderBatch(firstOrderId, lastOrderId);
  console.log(`orderArray length is ${orderArray.length}`);

  // for (let i = 0; i < orderArray.length; i++) {
  //   console.log(`${orderArray[i].orderId} and ${JSON.stringify(orderArray[i])}`);   
  // }    
  
  await network.saveArray(theContract, 'saveArray', orderArray);

}


const testy = async () => {

  const res = await network.getHistoryForKey(theContract, 'getHistoryForKey', '2003');

  let allResults = '';
  const js = JSON.parse(res);
  //Convert the array of ASCII values into a character string
  js.data.toString().split(',').forEach((s) => (sb.append(String.fromCharCode(parseInt(s, 10)))));
  //Parse the string back into a JSON object
  const myJson = JSON.parse(sb.toString());
  console.log('--------------------------------------------------------------------');

  //Now all items in the history object array can be accessed
  for (var myKey in myJson) {
    console.log(myJson[myKey].Value);
    const dt = new Date(parseInt(myJson[myKey].Timestamp.seconds.low) * 1000);
    // console.log(myJson[myKey].Timestamp.seconds.low);
    console.log(dt.toISOString());

    console.log('--------------------------------------------------------------------');

  }

}

/**
 * Test harness for displaying transaction history
 */
// testy();


// network.keyExists(theContract, 'orderExists', '1004')  ;

// network.createKeyValue(theContract, 'createOrder', order.orderId, JSON.stringify(order));

// network.updateKeyValue(theContract, 'updateOrder', order.orderId, JSON.stringify(order));

// createOrders(2000, 2010);

// network.deleteKeyValue(theContract, 'deleteOrder','1001');

// saveOrderBatch(2057, 2156);

network.readKeyValue(theContract, 'readOrder', order.orderId);

// const str = createOrderBatch(2000, 2010);
// console.log(str);

