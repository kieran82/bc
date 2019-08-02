/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require('node-stringbuilder');
const sb = new StringBuilder();

const network = require('./network');

const testIn = 
  {
  testResultId: 'T103',
  docType: 'testResult',
  client: 'Shanagarry',
  stockId: '1335',
  result: 'Safe'
  };

const testy = async () => {

  const res = await network.getHistoryForKey(testIn.testResultId);

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


// network.productTestsExists(testIn.testResultId)  ;

// network.createProductTests(testIn.testResultId, JSON.stringify(testIn));

// network.updateProductTests(testIn.testResultId, JSON.stringify(testIn));

// network.readProductTests(testIn.testResultId);

// network.deleteProductTests(testIn.testResultId);
