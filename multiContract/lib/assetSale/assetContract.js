/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AssetContract extends Contract {

    async initLedger(ctx) {
      const asset = [
        {
          "Number": 1,
          "AssetId": "A101",  
          "DocType": "Asset-Ledger",                             
          "Comment": "Tally Ho",
          "Price": 30          
        },
        {
          "Number": 2,
          "AssetId": "A102",  
          "DocType": "Asset-Ledger",                             
          "Comment": "Tally Ho",
          "Price": 30   
        },
        {
          "Number": 3,
          "AssetId": "A103",  
          "DocType": "Asset-Ledger",                             
          "Comment": "Tally Ho",
          "Price": 255   
        },
        {
          "Number": 4,
          "AssetId": "A104",  
          "DocType": "Asset-Ledger",                             
          "Comment": "Tally Ho",
          "Price": 133   
        },
        {
          "Number": 5,
          "AssetId": "A105",  
          "DocType": "Asset-Ledger",                             
          "Comment": "Tally Ho",
          "Price": 25   
        },      
        {
          "Number": 6,
          "AssetId": "A106",  
          "DocType": "Asset-Ledger",                             
          "Comment": "Tally Ho",
          "Price": 2150   
        },                            
      ];

      for (let i = 0; i < asset.length; i++) {
          await ctx.stub.putState(asset[i].AssetId, Buffer.from(JSON.stringify(asset[i])));
      }

    }

    /**
     * 
     * @param {The contract to use} ctx 
     * @param {An array of batch objects. There is currently no size limit
     *  for this array, but some limit should be set. We will have to see how badly performance 
     *  is affected.} asset 
     */
    async saveArray(ctx, strArray){
        const asset = JSON.parse(strArray);
        
        for (let i = 0; i < asset.length; i++) {
            await ctx.stub.putState(asset[i].AssetId, Buffer.from(JSON.stringify(asset[i])));      
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
     * @param {The AssetId value, which is the key for the block} AssetId 
     */
    async getHistoryForKey(ctx, AssetId) {
      const exists = await this.recordExists(ctx, AssetId);

      if (!exists) {
        throw new Error(`The Asset ID of ${AssetId} does not exist`);
      }

      let resultsIterator = await ctx.stub.getHistoryForKey(AssetId);
      let results = await this.getAllResults(resultsIterator, true);

      return Buffer.from(JSON.stringify(results));
    }

    /**
     * 
     * @param {The name of the contract} ctx 
     * @param {The AssetId for the start of the range} startId 
     * @param {The AssetId beyond the end of the search range i.e. not included in result} endId 
     */
    async getStateByRange(ctx, startId, endId) {
      const exists = await this.recordExists(ctx, startId);

      if (!exists) {
        throw new Error(`The Asset ID of ${startId} does not exist`);
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
     * @param {The AssetId, which is the key} keyValueId
     */
    async recordExists(ctx, keyValueId) {
      const buffer = await ctx.stub.getState(keyValueId);
      return (!!buffer && buffer.length > 0);
    }

    /**
     * 
     * @param {The name of the contract} ctx 
     * @param {The AssetId, which is the key} keyValueId 
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
     * @param {The AssetId value, which is the key} keyValueId 
     */
    async readKeyValue(ctx, keyValueId) {
      const exists = await this.recordExists(ctx, keyValueId);

      if (!exists) {
        throw new Error(`The record ${keyValueId} does not exist`);
      }

      const buffer = await ctx.stub.getState(keyValueId);
      const asset = JSON.parse(buffer.toString());
      return asset;
    }

    /**
     * 
     * @param {The name of the contract} ctx 
     * @param {The AssetId value, which is the key} keyValueId
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
     * @param {The AssetId value, which is the key} keyValueId
     */
    async deleteKeyValue(ctx, keyValueId) {
      const exists = await this.recordExists(ctx, keyValueId);
      
      if (!exists) {
        throw new Error(`The record for ${keyValueId} does not exist`);
      }

      await ctx.stub.deleteState(keyValueId);
    }

    /**
     * Logic Section
     */



}

module.exports = AssetContract;
