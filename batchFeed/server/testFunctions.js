/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require('node-stringbuilder');
const sb = new StringBuilder();
const network = require('./network');
const theContract = 'batchfeed';

const batchExisting =
{
  "Number": 1,
  "BatchId": "1001",
  "DocType": "docType",
  "Vessel": "Dreadnought",
  "CatchDate": "2019-06-22",
  "LogSheetNumber": 4123,
  "LandingDate": "2019-06-24",
  "Port": "Castletownbere",
  "FAOArea": "Area1",
  "FishingGear": "Large Nets",
  "Comment": "Added a comment",
  "Farm": "N/A",
  "ProductionDate": "N/A",
  "PackDate": "2019-06-24",
  "FreezeDate": "2019-06-05",
  "DefrostDate": "N/A",
  "UseByDate": "2019-08-24",
  "CountryOfOrigin": "Ireland",
  "Temperature": 2,
  "SupplierTraceId": 44123,
  "TransportCompany": "N/A",
  "Haulier": "N/A",
  "Reference": "N/A"
};

const batchNew =
{
  "Number": 11,
  "BatchId": "1007",
  "DocType": "ErrigalBatchFeed",
  "Vessel": "Dreadlocks",
  "CatchDate": "2019-09-22",
  "LogSheetNumber": 4123,
  "LandingDate": "2019-09-24",
  "Port": "Castletownbere",
  "FAOArea": "Area1",
  "FishingGear": "Large Nets",
  "Comment": "No Comment on the comments",
  "Farm": "N/A",
  "ProductionDate": "N/A",
  "PackDate": "2019-09-24",
  "FreezeDate": "2019-10-05",
  "DefrostDate": "N/A",
  "UseByDate": "2020-12-24",
  "CountryOfOrigin": "Ireland",
  "Temperature": -15,
  "SupplierTraceId": 44123,
  "TransportCompany": "N/A",
  "Haulier": "N/A",
  "Reference": "N/A"
};


//Arbitrary object used to store a generic ID for search purposes

/** Check for Existence */
// network.keyExists(theContract, 'batchFeedExists', batchExisting.BatchId);


/** Create new Blocks */
// network.createKeyValue(theContract, 'createBatchFeed', batchNew.BatchId, JSON.stringify(batchNew));

/** Read Blocks */

// network.readKeyValue(theContract, 'readBatchFeed', batchNew.BatchId);


/** Update Blocks */

// network.updateKeyValue(theContract, 'updateBatchFeed', batchExisting.BatchId, JSON.stringify(batchExisting));


/** Delete Blocks */

// network.deleteKeyValue(theContract, 'deleteBatchFeed', batchNew.BatchId);



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

/** Range Queries */

const getStateByRange = async (contractName, func, startId, endId) => {

  const res = await network.getStateByRange(contractName, func, startId, endId);
  const result = JSON.parse(res);

  result.data.toString().split(',').forEach((s) => (sb.append(String.fromCharCode(parseInt(s, 10)))));
  const myJson = JSON.parse(sb.toString());

  // Now all items in the history object array can be accessed
  for (var myKey in myJson) {
    console.log("--------------------------------------------------------------------");

    console.log(myJson[myKey].Value);

    console.log("--------------------------------------------------------------------");

  }

}

// getStateByRange(theContract, 'getStateByRange', '1002', '');

getHistory(theContract, 'getHistoryForKey', '1001');
