/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ClientContract extends Contract {

  async initLedger(ctx) {
    const client = [
      {
        "Number": 1,
        "ClientId": "1001",
        "DocType":"Client-Ledger",
        "Fund": 4500.50,
        "ClientName": "Client A",
        "Comment": "NoComment"
      },
      {
        "Number": 2,
        "ClientId": "1002",
        "DocType":"Client-Ledger",
        "Fund": 5500,
        "ClientName": "Client B",
        "Comment": "No Comments"
      },
      {
        "Number": 3,
        "ClientId": "1003",
        "DocType":"Client-Ledger",
        "Fund": 5500,
        "ClientName": "Client B52",
        "Comment": "No Comments"
      },      
    ];

    for (let i = 0; i < client.length; i++) {
      client.DocType = "client-ledger";
      await ctx.stub.putState(client[i].ClientId, Buffer.from(JSON.stringify(client[i])));
    }
  }

  
  /**
   * 
   * @param {The contract to use} ctx 
   * @param {An array of batch objects. There is currently no size limit
  *  for this array, but some limit should be set. We will have to see how badly performance 
  *  is affected.} client 
  */
  async saveArray(ctx, strArray){
    const client = JSON.parse(strArray);

    for (let i = 0; i < client.length; i++) {
      await ctx.stub.putState(client[i].ClientId, Buffer.from(JSON.stringify(client[i])));      
    }    
  }
 
 
  /**
  * This function iterates over the results generated in the getHistoryForKey function.
  * As it is specific to a transaction history, other fields that are not normally returned
  * are included here, such as tx_id, timestamp and the deleted flag.
  * 
  * @param {The results iterator generated in getHistoryForKey function} iterator
  * @param {This is currently always true while this function is specific to get transaction history records} isHistory 
  */
  async getAllResults(iterator, isHistory) {
    let allResults = [];
    
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};

        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.IsDelete = res.value.is_delete.toString();
          
          try {
              jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
              jsonRes.Value = res.value.value.toString('utf8');
          }
        } else {
          jsonRes.Key = res.value.key;

          try {
              jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
              jsonRes.Record = res.value.value.toString('utf8');
          }
        }

        allResults.push(jsonRes);
      }

      if (res.done) {
        await iterator.close();
        return allResults;
      }
    }
  }

  async getRangeResults(iterator) {
    let allResults = [];

    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};

        jsonRes._id = res.value._id;

        try {
          jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          jsonRes.Value = res.value.value.toString('utf8');
        }

        allResults.push(jsonRes);
      }

      if (res.done) {
        await iterator.close();
        return allResults;
      }
    }
  }  

  /** Range Queries */
  /**
  * 
  * @param {The name of the contract} ctx
  * @param {The ClientId value, which is the key for the block} ClientId 
  */
  async getHistoryForKey(ctx, ClientId) {
    const exists = await this.recordExists(ctx, ClientId);

    if (!exists) {
      throw new Error(`The Client ID of ${ClientId} does not exist`);
    }

    let resultsIterator = await ctx.stub.getHistoryForKey(ClientId);
    let results = await this.getAllResults(resultsIterator, true);

    return Buffer.from(JSON.stringify(results));
  }

  /**
  * 
  * @param {The name of the contract} ctx 
  * @param {The ClientId for the start of the range} startId 
  * @param {The ClientId beyond the end of the search range i.e. not included in result} endId 
  */
  async getStateByRange(ctx, startId, endId) {
    const exists = await this.recordExists(ctx, startId);

    if (!exists) {
      throw new Error(`The Client ID of ${startId} does not exist`);
    }

    let resultsIterator = await ctx.stub.getStateByRange(startId, endId);
    let results = await this.getRangeResults(resultsIterator);

    return results;

  }

  /**
  * 
  * @param {The name of the contract} ctx 
  * @param {The query selector string} query 
  */
  async getQueryResult(ctx, query) {

    let resultsIterator = await ctx.stub.getQueryResult(query);
    let results = await this.getRangeResults(resultsIterator);

    return results;
  }     

    //========================================================

  /**
  * This is a utility function to check for the existence of 
  * a block before trying any further processing.
  * 
  * @param {The name of the contract} ctx 
  * @param {The ClientId, which is the key} keyValueId
  */
  async recordExists(ctx, keyValueId) {
    const buffer = await ctx.stub.getState(keyValueId);
    return (!!buffer && buffer.length > 0);
  }

  /**
  * 
  * @param {The name of the contract} ctx 
  * @param {The ClientId, which is the key} keyValueId 
  * @param {The JSON object which is stored in the ledger} value 
  */
  async createKeyValue(ctx, keyValueId, value) {
    const exists = await this.recordExists(ctx, keyValueId);

    if (exists) {
      throw new Error(`The record ${keyValueId} already exists`);
    }

    const buffer = Buffer.from(value);
    await ctx.stub.putState(keyValueId, buffer);
  }

  /**
  * 
  * @param {The name of the contract} ctx 
  * @param {The ClientId value, which is the key} keyValueId 
  */
  async readKeyValue(ctx, keyValueId) {
    const exists = await this.recordExists(ctx, keyValueId);

    if (!exists) {
      throw new Error(`The record ${keyValueId} does not exist`);
    }

    const buffer = await ctx.stub.getState(keyValueId);
    const client = JSON.parse(buffer.toString());
    return client;
  }

  /**
  * 
  * @param {The name of the contract} ctx 
  * @param {The ClientId value, which is the key} keyValueId
  * @param {The updated block to save to the ledger} newValue 
  */
  async updateKeyValue(ctx, keyValueId, newValue) {
    const exists = await this.recordExists(ctx, keyValueId);
    
    if (!exists) {
      throw new Error(`The record for ${keyValueId} does not exist`);
    }

    const buffer = Buffer.from(newValue);
    await ctx.stub.putState(keyValueId, buffer);
  }

  /**
  *
  * @param {The name of the contract} ctx
  * @param {The ClientId value, which is the key} keyValueId
  */
  async deleteKeyValue(ctx, keyValueId) {
    const exists = await this.recordExists(ctx, keyValueId);
    
    if (!exists) {
      throw new Error(`The record for ${keyValueId} does not exist`);
    }

    await ctx.stub.deleteState(keyValueId);
  }
 
 }
 
 module.exports = ClientContract;