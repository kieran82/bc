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
  "DocType": "ErrigalBatchFeed",
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

const newBatchFeed = [
  {
    "Number": 1,
    "BatchId": "1001",
    "DocType": "ErrigalBatchFeed",
    "Vessel": "Dreadnought",
    "CatchDate": "2019-06-22",
    "LogSheetNumber": 4123,
    "LandingDate": "2019-06-24",
    "Port": "Castletownbere",
    "FAOArea": "Area1",
    "FishingGear": "Large Nets",
    "Comment": "NoComment",
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
  },
  {
    "Number": 2,
    "BatchId": "1002",
    "DocType": "ErrigalBatchFeed",
    "Vessel": "Dreadnought",
    "CatchDate": "2019-06-22",
    "LogSheetNumber": 4123,
    "LandingDate": "2019-06-24",
    "Port": "Castletownbere",
    "FAOArea": "Area1",
    "FishingGear": "Nets",
    "Comment": "Updated",
    "Farm": "N/A",
    "ProductionDate": "N/A",
    "PackDate": "2019-06-22",
    "FreezeDate": "2019-06-05",
    "DefrostDate": "N/A",
    "UseByDate": "2019-08-24",
    "CountryOfOrigin": "Ireland",
    "Temperature": 3,
    "SupplierTraceId": 44124,
    "TransportCompany": "Take Me Home Freighty",
    "Haulier": "N/A",
    "Reference": "N/A"
  },
  {
    "Number": 2003,
    "BatchId": "2003",
    "DocType": "ErrigalBatchFeed",
    "Vessel": "Dread Locks",
    "CatchDate": "2019-06-22",
    "LogSheetNumber": 412,
    "LandingDate": "2019-06-24",
    "Port": "Castletownbere",
    "FAOArea": "Area12",
    "FishingGear": "SchNets",
    "Comment": "New",
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
    "Haulier": "Haul Away Lads",
    "Reference": "N/A"
  },
  {
    "Number": 2004,
    "BatchId": "2004",
    "DocType": "ErrigalBatchFeed",
    "Vessel": "Dreadly",
    "CatchDate": "2019-06-22",
    "LogSheetNumber": 4123,
    "LandingDate": "2019-06-24",
    "Port": "Castletownsend",
    "FAOArea": "Area10",
    "FishingGear": "Nets and Basket",
    "Comment": "New",
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
  },
  {
    "Number": 5,
    "BatchId": "1005",
    "DocType": "ErrigalBatchFeed",
    "Vessel": "Marie Celeste",
    "CatchDate": "2019-06-22",
    "LogSheetNumber": 4123,
    "LandingDate": "2019-06-24",
    "Port": "Castletownbere",
    "FAOArea": "Area 13",
    "FishingGear": "Nets",
    "Comment": "Updated",
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
  },
  {
    "Number": 2006,
    "BatchId": "2006",
    "DocType": "ErrigalBatchFeed",
    "Vessel": "N/A",
    "CatchDate": "2019-06-22",
    "LogSheetNumber": "N/A",
    "LandingDate": "2019-06-24",
    "Port": "N/A",
    "FAOArea": "N/A",
    "FishingGear": "N/A",
    "Comment": "New",
    "Farm": "My Great Big Farm",
    "ProductionDate": "2019-07-03",
    "PackDate": "2019-07-24",
    "FreezeDate": "2019-07-25",
    "DefrostDate": "N/A",
    "UseByDate": "2019-08-24",
    "CountryOfOrigin": "Ireland",
    "Temperature": 2,
    "SupplierTraceId": 44123,
    "TransportCompany": "N/A",
    "Haulier": "N/A",
    "Reference": 2123
  },
];

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

  // Now all items in the history object array can be accessed
  for (var myKey in result) {
    console.log("--------------------------------------------------------------------");
    console.log(result[myKey].Value);
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

  // Now all items in the history object array can be accessed
  console.log("--------------------------------------------------------------------");
  for (var myKey in result) {
    console.log(result[myKey].Value );
    console.log("--------------------------------------------------------------------");
  }
}

const saveArray = async (contract, func, array) => {
  // console.log(contract);
  array.forEach((s) => {
    s.Comment = s.Comment + " --- other comment";

  });

  let strArray = JSON.stringify(array);

  await network.saveArray(contract, func, strArray); //  
}

let queryString = '{ \
    "selector": { \
        "_id": { \
            "$gt": "1003" \
        } \
    } \
}';

const testArray = (arr) => {

  let str = JSON.stringify(arr);

  // console.log(str);
  const newBatchFeed = JSON.parse(str);

  for (let i = 0; i < newBatchFeed.length; i++) {
    // await ctx.stub.putState(newBatchFeed[i].BatchId, Buffer.from(JSON.stringify(newBatchFeed[i])));
    console.log(`This is batch id ${newBatchFeed[i].BatchId}`);

  }     
};

const getFormattedDate = () => {
  try {
    console.log('Inside');
    // d = new Date("2019-02-02")

    
    let date = new Date("2019-02-02");
    let day = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString();
    const month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    const year = date.getFullYear();
    return day + "-" + month + "-" + year;

  } catch (error) {
    console.log(error);
    
  }  
  
};

const objToString = (number) => {
  const obj = {
    "Number": 1,
    "BatchId": "1001",
    "DocType": "ErrigalBatchFeed",
    "Vessel": "Dreadnought" ,
    "CatchDate": "2019-06-22",
    "LogSheetNumber": 4123,
    "LandingDate": "2019-06-24",
    "Port": "Castletownbere",
    "FAOArea": "Area1",
    "FishingGear": "Large Nets",
    "Comment": "NoComment",
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

  let curDate = Date.now()
  obj.Number = number;
  obj.BatchId = number.toString();
  obj.LogSheetNumber = number + 23;
  obj.SupplierTraceId = number + 10057;
  obj.Vessel = "Dreadnought" + number.toString();

  // console.log(JSON.stringify(obj));  
  return obj;

}

const newArray = (start, end) => {
  let arr = [];

  for (let i = start; i < end; i++) {
    let obj = objToString(i);
    arr.push(obj);
  }

  // arr.forEach((s) => {
  //   console.log(s.BatchId);
    
  // });

  // console.log(arr[22]);

  return arr;
  
};

const arr = newArray(4000, 5000);
saveArray(theContract, 'saveArray', arr);

// getQueryResult( 'getQueryResult', queryString);

// getStateByRange(theContract, 'getStateByRange', '4002', '4005');

// getHistory(theContract, 'getHistoryForKey', '2003');

// testArray(newBatchFeed);

// console.log(getFormattedDate());

// objToString(3001);
//  newArray(3000, 4000);