/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require('node-stringbuilder');
const sb = new StringBuilder();
const theContract = 'daly_rawmaterials';

const network = require('./network');

const rawMaterialIn = 
  {
    batchId: '3445',
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
      supplierId: '1001',
      quantity: '144',
      qtyUnitMeasurement: 'Kg',
      product: 'Organically Salmony',
      dateReceived: '2019-11-17',
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
    // console.log(`This is the (i)  ${i}`);
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
const saveRawmaterialBatch = async (firstBatchId, lastBatchId) => {
  let counter = 0;
  //saveArray
  let batchArray = [];
  batchArray = createRawmaterialBatch(firstBatchId, lastBatchId);
  console.log(`batchArray length is ${batchArray.length}`);

  // for (let i = 0; i < batchArray.length; i++) {
  //   console.log(`${batchArray[i].BatchId} and ${JSON.stringify(batchArray[i])}`);   
  // }    
  
  await network.saveArray(theContract, 'saveArray', batchArray);

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

// testy();

// const keyValue = "1001";
// network.keyExists(theContract, 'rawmaterialExists', keyValue)  ;

// network.createKeyValue(theContract, 'createRawmaterial', rawMaterialIn.batchId, JSON.stringify(rawMaterialIn));

// network.updateKeyValue(theContract, 'updateRawmaterial', rawMaterialIn.batchId, JSON.stringify(rawMaterialIn));

// saveRawmaterialBatch(3401, 3500);

// network.deleteKeyValue(theContract, 'deleteRawmaterial','1001');

// saveRawmaterialBatch(2057, 2156);

network.readKeyValue(theContract, 'readRawmaterial', rawMaterialIn.batchId);

// network.deleteRawMaterial(rawMaterialIn.batchId);