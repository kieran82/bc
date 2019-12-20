/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');
const StringBuilder = require('node-stringbuilder');
const sb = new StringBuilder();
const network = require('./network');
// const stock = require('./stock_network');
// const rawmaterials = require('./rawmaterials_network');
// const orders = require('./orders_network');
// const tests = require('./tests_network');
const theAssetSaleContract = 'asset-sale';
const theAssetContract = 'asset';
const theClientContract = 'client'
const theClient = 'Errigal';


  const assetSale = 
  {
    "Number": 7,
    "AssetSaleId": "AS1002",
    "AssetId": "AS1007",
    "DocType":"AssetSale-Ledger",
    "AssetOwnerId": "1001",
    "AssetBuyerId": "1003",
    "Comment": "NoComment boo!",
    "TransactionCompletionDate": "01-12-2019",
    "RequestDate": "12-12-2019",
    "Price": 21.18            
  };

  const client = 
  {
    "Number": 4,
    "ClientId": "1003",  
    "DocType": "Client-Ledger",                             
    "Comment": "Hello there client! Tally Ho Number 4",
    "Funds": 5000          
  };    

  const asset = 
  {
    "Number": 1,
    "AssetId": "A107",  
    "DocType": "Asset-Ledger",                             
    "Comment": "Tally Ho",
    "Price": 300         
  };



//Arbitrary object used to store a generic ID for search purposes

/** Check for Existence */
// network.keyExists('stock', 'stockExists', newStock.stockId);

// network.keyExists('rawmaterials', 'rawmaterialExists', rawMaterial.batchId);

// network.keyExists('orders', 'orderExists', newOrder.orderId);

// network.keyExists('ProductTests', 'productTestsExists', testResults.testResultId);

/** Create new Blocks */
// network.createKeyValue('rawmaterials', 'createRawmaterial', rawMaterial.batchId, JSON.stringify(rawMaterial));

// network.createKeyValue(theAssetSaleContract, 'createKeyValue', assetSale.AssetSaleId, JSON.stringify(assetSale));

// network.createKeyValue(theAssetContract, 'createKeyValue', asset.AssetId, JSON.stringify(asset));

// network.createKeyValue(theClientContract, 'createKeyValue', client.ClientId, JSON.stringify(client));

/** Read Blocks */

// network.readKeyValue('client', 'readKeyValue', "1001");

// network.readKeyValue('stock', 'readStock', newStock.stockId);

// console.log(assetSale.AssetSaleId);

// network.crossChannelRead (theAssetSaleContract, 'crossChannelRead', client.ClientId, 'client');

// const values = [];
// const contractToCall = 'client';
// const channel = 'mychannel';

// values.push('createKeyValue');
// values.push(client.ClientId);
// values.push(JSON.stringify(client));

// network.parameterisedCrossChannelCall(theAssetSaleContract, 'parameterisedCrossChannelCall', values, channel);

 network.exchangeAsset(theAssetSaleContract, 'exchangeAsset', assetSale.AssetSaleId, assetSale.AssetBuyerId);
// console.log(res.toString());



// obj = JSON.parse(res.toString());
// console.log(JSON.stringify(obj));


// network.readKeyValue(theAssetSaleContract, 'readKeyValue', "AS1002");
// network.readKeyValue(theAssetContract, 'readKeyValue', asset.AssetId);
// network.readKeyValue(theClientContract, 'readKeyValue', client.ClientId);

// network.readKeyValue('ProductTests', 'readProductTests', testResults.testResultId);

/** Update Blocks */

// network.updateKeyValue('rawmaterials', 'updateRawmaterial', rawMaterial.batchId, JSON.stringify(rawMaterial));

// network.updateKeyValue('stock', 'updateStock', newStock.stockId, JSON.stringify(newStock));

// network.updateKeyValue('orders', 'updateOrder', newOrder.orderId, JSON.stringify(newOrder));

// network.updateKeyValue('ProductTests', 'updateProductTests', testResults.testResultId, JSON.stringify(testResults));

/** Delete Blocks */

// network.deleteKeyValue('rawmaterials', 'deleteRawmaterial', rawMaterial.batchId);

// network.deleteKeyValue('stock', 'deleteStock', newStock.stockId);

// network.deleteKeyValue('orders', 'deleteOrder', newOrder.orderId);

// network.deleteKeyValue('ProductTests', 'deleteProductTests', testResults.testResultId);


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

// getHistory('rawmaterials', 'getHistoryForKey', rawMaterial.batchId);

// getHistory('stock', 'getHistoryForKey', newStock.stockId);

// getHistory('orders', 'getHistoryForKey', newOrder.orderId);

// getHistory('ProductTests', 'getHistoryForKey', testResults.testResultId);

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

// getStateByRange('stock', 'getStateByRange', '102', '');