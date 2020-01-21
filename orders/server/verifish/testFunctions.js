/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require('node-stringbuilder');
const sb = new StringBuilder();
const theContract = 'verifish-orders';


const network = require('./network');

let order = 
{
  orderId: '1114',
  docType: 'foodOrder',
  despatchDate: '2020-01-10',
  dateReceived: '2020-01-10',
  buyerId: '0001',
  supplierId: '1114',
  quantity: 750,
  qtyUnitMeasurement: 'Kg',
  processUsed: 'Smoking',
  orderLines: [
      { orderLine: 1, sourceBatchId: '101', tested: 'Yes', testDate: '10/01/2020', quantity: 250, qtyUnitMeasurement: 'Kg'},
      { orderLine: 2, sourceBatchId: '102', tested: 'Yes', testDate: '10/01/2020', quantity: 250, qtyUnitMeasurement: 'Kg'},
      { orderLine: 3, sourceBatchId: '103', tested: 'Yes', testDate: '10/01/2020', quantity: 250, qtyUnitMeasurement: 'Kg'}
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
    orderId: '1114',
    docType: 'foodOrder',
    despatchDate: '2020-01-10',
    dateReceived: '2020-01-10',
    buyerId: '0001',
    supplierId: '1114',
    quantity: 750,
    qtyUnitMeasurement: 'Kg',
    processUsed: 'Smoking',
    orderLines: [
        { orderLine: 1, sourceBatchId: '101', tested: 'Yes', testDate: '10/01/2020', quantity: 250, qtyUnitMeasurement: 'Kg'},
        { orderLine: 2, sourceBatchId: '102', tested: 'Yes', testDate: '10/01/2020', quantity: 250, qtyUnitMeasurement: 'Kg'},
        { orderLine: 3, sourceBatchId: '103', tested: 'Yes', testDate: '10/01/2020', quantity: 250, qtyUnitMeasurement: 'Kg'}
    ],
};
  
  let order = {};
  order = orderTemplate;
  order.orderId = orderId;
  order.quantity = 90210;
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

  const res = await network.getHistoryForKey(theContract, 'getHistoryForKey', '1004');

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

const read = async(order) => {
  order = await network.readKeyValue(theContract, 'readOrder', order);
  order = JSON.parse(order);
  console.log(`This is the order quatity ${order.quantity}`);
}

/**
 * Test harness for displaying transaction history
 */
// testy();


// network.keyExists(theContract, 'orderExists', '1114')  ;
let newOrder = createOrderObject("1114");
// newOrder.quantity = 133;
// newOrder.processUsed = 'Very Smokey indeed';
// network.createKeyValue(theContract, 'createOrder', newOrder.orderId, JSON.stringify(newOrder));
// network.createOrder( newOrder.orderId, JSON.stringify(newOrder));

// network.updateKeyValue(theContract, 'updateOrder', newOrder.orderId, JSON.stringify(newOrder));


// createOrders(2000, 2010);

// network.deleteKeyValue(theContract, 'deleteOrder','1114');

// saveOrderBatch(2057, 2156);



// order = JSON.parse(order);
// let order1 = JSON.parse(order);
// console.log(`This is the order quantity ${order.quantity}`);

// const str = createOrderBatch(2000, 2010);
// console.log(str);

read(newOrder.orderId);