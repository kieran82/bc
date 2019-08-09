/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require('node-stringbuilder');
const sb = new StringBuilder();

const network = require('./network');

const rawMaterialIn = 
  {
    batchId: '1003',
    docType: 'materials',
    certified: 'Yes Infant Little Person!!!!!!',
    supplierId: '0001',
    quantity: '150',
    qtyUnitMeasurement: 'Kg',
    product: 'Organically Salmony and stuff',
    dateReceived: '2019-07-17',
  };

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
    // console.log(myJson[myKey].Value);
    const dt = new Date(parseInt(myJson[myKey].Timestamp.seconds.low) * 1000);
    // console.log(myJson[myKey].Timestamp.seconds.low);
    console.log(dt.toISOString());

    console.log("--------------------------------------------------------------------");

  }

}

testy();

// network.rawMaterialExists("1001")  ;

// network.createRawMaterial(rawMaterialIn.batchId, JSON.stringify(rawMaterialIn));

// network.updateRawMaterial(rawMaterialIn.batchId, JSON.stringify(rawMaterialIn));

// network.readRawMaterial(rawMaterialIn.batchId);

// network.deleteRawMaterial(rawMaterialIn.batchId);