/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require('node-stringbuilder');
const sb = new StringBuilder();
const theContract = 'errigal_rawmaterials';

const network = require('./network');

const rawMaterialIn = 
  {
    batchId: '2511',
    docType: 'materials',
    certified: 'Yes',
    supplierId: '1001',
    quantity: '144',
    qtyUnitMeasurement: 'Kg',
    product: 'Organically Salmoneeeeey Salmonooooo',
    dateReceived: '2019-08-17',
  };

  const createRawMaterialObject = (batchId) => {
    // console.log(`Rawmaterial ID is ${BatchId}`);
    let rawMaterialTemplate = 
    {
      batchId: '1003',
      docType: 'materials',
      certified: 'Yes',
      supplierId: '1002',
      quantity: '144',
      qtyUnitMeasurement: 'Kg',
      product: 'Organic Salmon',
      dateReceived: '2019-12-17',
    };
    
    let rawmaterial = {};
    rawmaterial = rawMaterialTemplate;
    rawmaterial.batchId = batchId;
    rawmaterial.quantity = 899
    // console.log(`Rawmaterial ID is ${Rawmaterial.BatchId}`);
    return rawmaterial;
  }

/**
 * Create an array of Rawmaterial objects based on a lower and upper limit
 * @param {*} firstBatchId 
 * @param {*} lastBatchId 
 */
const createRawmaterialBatch = (firstBatchId, lastBatchId) => {
  let batchArray = [];

  for(let i = firstBatchId; i <= lastBatchId; i++) {

    batchArray.push(createRawMaterialObject(i.toString()));
    // console.log(Rawmaterial.BatchId);
    
    //Create a JSON object
    // batchArray.push(Rawmaterial);
  }  

  // for (let i = 0; i < batchArray.length; i++) {
  //   console.log(`${batchArray[i].BatchId} `);   
  // }      

  return batchArray;
}  

/**
 * Create and save a batch of Rawmaterials identified by the range of numbers given
 * @param {The first number in the BatchId range} firstBatchId 
 * @param {the last number in the BatchId range} lastBatchId 
 */
const saveRawmaterialBatch = async (firstBatchId, lastBatchId, inIncrements) => {
  let counter = 0;
  //saveArray
  let batchArray = [];
  batchArray = createRawmaterialBatch(firstBatchId, lastBatchId);
  console.log(`batchArray length is ${batchArray.length}`);

  if (inIncrements === true){
    
    await network.saveArrayOneAtATime(theContract, 'createRawmaterial', batchArray);
  }
  else {
    await network.saveArray(theContract, 'saveArray', batchArray);
  }
  // for (let i = 0; i < batchArray.length; i++) {
  //   console.log(`${batchArray[i].BatchId} and ${JSON.stringify(batchArray[i])}`);   
  // }    
  
  

}

const testy = async () => {

  const res = await network.getHistoryForKey(rawMaterialIn.batchId);

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

/** 
 * Generic Query
 * 
*/
const getQueryResult = async (func, query) => {

  const res = await network.getQueryResult(theContract, func, query); //

  const result = JSON.parse(res);
  console.log(`${result.length} items returned`);
  
  // Now all items in the history object array can be accessed
  console.log("--------------------------------------------------------------------");
  for (var myKey in result) {
    console.log(result[myKey].Value );
    console.log("--------------------------------------------------------------------");
  }
}

let queryString = '{ \
  "selector": { \
      "batchId": { \
          "$eq": "4000" \
      } \
  } \
}';

getQueryResult( 'getQueryResult', queryString);

// testy();

// const keyValue = "3401";
// network.keyExists(theContract, 'rawmaterialExists', keyValue)  ;

// network.createKeyValue(theContract, 'createRawmaterial', rawMaterialIn.batchId, JSON.stringify(rawMaterialIn));

// network.updateKeyValue(theContract, 'updateRawmaterial', rawMaterialIn.batchId, JSON.stringify(rawMaterialIn));

// saveRawmaterialBatch(1100, 2100, false);

// network.deleteKeyValue(theContract, 'deleteRawmaterial','1001');

// saveRawmaterialBatch(3616, 4000, false);

// rawMaterialIn.batchId = "2511";
// network.readKeyValue(theContract, 'readRawmaterial', rawMaterialIn.batchId);

// network.deleteRawMaterial(rawMaterialIn.batchId);