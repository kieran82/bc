/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const StringBuilder = require('node-stringbuilder');
const sb = new StringBuilder();


class AssetSaleContract extends Contract {

    async initLedger(ctx) {

        const assetSale = [
            {
                "Number": 1,
                "AssetSaleId": "AS1001",
                "AssetId": "101",
                "DocType":"AssetSale-Ledger",
                "AssetOwnerId": "1002",
                "AssetBuyerId": "1001",
                "Comment": "NoComment",
                "TransactionCompletionDate": "01-12-2019",
                "RequestDate": "12-12-2019",
                "Price": 21.18            },
            {
                "Number": 2,
                "AssetSaleId": "AS1002",      
                "AssetId": "102",
                "DocType": "AssetSale-Ledger",                          
                "AssetOwnerId": "1003",
                "AssetBuyerId": "1002",
                "Comment": "NoComments",
                "TransactionCompletionDate": "01-12-2019",
                "RequestDate": "12-12-2019",
                "Price": 21.19
            },
            {
                "Number": 3,
                "AssetSaleId": "AS1003",   
                "AssetId": "103", 
                "DocType": "AssetSale-Ledger",                            
                "AssetOwnerId": "1001",
                "AssetBuyerId": "1002",
                "Comment": "It was tough but we managed it",
                "TransactionCompletionDate": "01-12-2019",
                "RequestDate": "12-12-2019",
                "Price": 212
            },
            {
                "Number": 4,
                "AssetSaleId": "AS1004",      
                "AssetId": "104",
                "DocType": "AssetSale-Ledger",                          
                "AssetOwnerId": "1002",
                "AssetBuyerId": "1001",
                "Comment": "Some Comments",
                "TransactionCompletionDate": "01-12-2019",
                "RequestDate": "12-12-2019",
                "Price": 121.10
            },
            {
                "Number": 5,
                "AssetSaleId": "AS1005",    
                "AssetId": "105", 
                "DocType": "AssetSale-Ledger",                           
                "AssetOwnerId": "1001",
                "AssetBuyerId": "1003",
                "Comment": "We did it",
                "TransactionCompletionDate": "01-12-2019",
                "RequestDate": "12-12-2019",
                "Price": 21.22
            },
            {
                "Number": 6,
                "AssetSaleId": "AS1006",  
                "AssetId": "106",
                "DocType": "AssetSale-Ledger",                             
                "AssetOwnerId": "1001",
                "AssetBuyerId": "1002",
                "Comment": "Tally Ho",
                "TransactionCompletionDate": "2019-07-03",
                "RequestDate": "2019-07-24",
                "Price": 2123
            },
        ];

        for (let i = 0; i < assetSale.length; i++) {
            assetSale[i].DocType = 'AssetSale-Ledger';
            await ctx.stub.putState(assetSale[i].AssetSaleId, Buffer.from(JSON.stringify(assetSale[i])));
        }


    }

    /**
     * 
     * @param {The contract to use} ctx 
     * @param {An array of batch objects. There is currently no size limit
     *  for this array, but some limit should be set. We will have to see how badly performance 
     *  is affected.} assetSale 
     */
    async saveArray(ctx, strArray){
        const assetSale = JSON.parse(strArray);
        
        for (let i = 0; i < assetSale.length; i++) {
            await ctx.stub.putState(assetSale[i].AssetSaleId, Buffer.from(JSON.stringify(assetSale[i])));      
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
     * @param {The AssetSaleId value, which is the key for the block} AssetSaleId 
     */
    async getHistoryForKey(ctx, AssetSaleId) {
      const exists = await this.recordExists(ctx, AssetSaleId);

      if (!exists) {
        throw new Error(`The ID of ${AssetSaleId} does not exist`);
      }

      let resultsIterator = await ctx.stub.getHistoryForKey(AssetSaleId);
      let results = await this.getAllResults(resultsIterator, true);

      return Buffer.from(JSON.stringify(results));
    }

    /**
     * 
     * @param {The name of the contract} ctx 
     * @param {The AssetSaleId for the start of the range} startId 
     * @param {The AssetSaleId beyond the end of the search range i.e. not included in result} endId 
     */
    async getStateByRange(ctx, startId, endId) {
      const exists = await this.recordExists(ctx, startId);

      if (!exists) {
        throw new Error(`The ID of ${startId} does not exist`);
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
     * @param {The AssetSaleId, which is the key} keyValueId
     */
    async recordExists(ctx, keyValueId) {
      const buffer = await ctx.stub.getState(keyValueId);
      return (!!buffer && buffer.length > 0);
    }

    /**
     * Updating can be done prior to a sale, but will be restricted to
     * vertain values.
     * @param {The name of the contract} ctx 
     * @param {The AssetSaleId value, which is the key} keyValueId
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
     * A deletion is probably not required
     * @param {The name of the contract} ctx
     * @param {The AssetSaleId value, which is the key} keyValueId
     */
    async deleteKeyValue(ctx, keyValueId) {
      const exists = await this.recordExists(ctx, keyValueId);JSON.stringify(assetSal)
      
      if (!exists) {
        throw new Error(`The record for ${keyValueId} does not exist`);
      }

      await ctx.stub.deleteState(keyValueId);
    }

    /**
     * Logic Section
     */

    /**
     * The asset for sale is created by the seller.
     * @param {The name of the contract} ctx 
     * @param {The AssetSaleId, which is the key} keyValueId 
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
     * This can be read by all potential customers
     * @param {The name of the contract} ctx 
     * @param {The AssetSaleId value, which is the key} keyValueId 
     */
    async readKeyValue(ctx, keyValueId) {
      const exists = await this.recordExists(ctx, keyValueId);

      if (!exists) {
        throw new Error(`The record ${keyValueId} does not exist`);
      }

      const buffer = await ctx.stub.getState(keyValueId);
      const assetSale = JSON.parse(buffer.toString());
      return assetSale;
    }     

    /**
     * The asset for sale is created by the seller.
     * @param {The name of the contract} ctx 
     * @param {The AssetSaleId, which is the key} keyValueId 
     * @param {The JSON object which is stored in the ledger} value 
     */
    async exchangeAsset(ctx, assetId, buyerId) {
      // {
      //   "Number": 1,
      //   "AssetSaleId": "1001",
      //   "AssetId": "101",
      //   "DocType":"AssetSale-Ledger",
      //   "AssetOwnerId": "1002",
      //   "AssetBuyerId": "1001",
      //   "Comment": "NoComment",
      //   "TransactionCompletionDate": "01-12-2019",
      //   "RequestDate": "12-12-2019",
      //   "Price": 21.18            };

      // {
      //   "Number": 1,
      //   "ClientId": "2001",
      //   "DocType":"Client-Ledger",
      //   "Fund": 4500.50,
      //   "ClientName": "Client A",
      //   "Comment": "NoComment"
      // };

      // Does the assesSale exist
      const exists = await this.recordExists(ctx, assetId);
      
      if (!exists) {
        throw new Error(`The Asset Sale record for ${assetId} does not exist`);
      }
      
      // Get the AssetSale object for this ID
      let buffer = await ctx.stub.getState(assetId);
      let assetSale = JSON.parse(buffer.toString());
      

      // buffer = await ctx.stub.invokeChaincode('client', ['readKeyValue', buyerId],  'mychannel');
      let buyer = await this.crossChannelRead(ctx, 'client', buyerId, 'mychannel')
      let seller = await this.crossChannelRead(ctx, 'client', assetSale.AssetOwnerId, 'mychannel')

      assetSale.AssetBuyerId = buyer.ClientId;

      if (assetSale.AssetOwnerId !== seller.ClientId) {
        throw new Error(`The Asset owner ID ${seller.ClientId} does not match`);
      }        

      // If buyer has enough money
      if (buyer.Funds >= assetSale.Price){
        buyer.Funds -= assetSale.Price;
        assetSale.AssetOwnerId = buyer.ClientId;
        seller.Funds += assetSale.Price;
        const dt = new Date();
        assetSale.TransactionCompletionDate = dt.toISOString();
        assetSale.Comment += `\n${buyer.ClientId}  purchased asset ${assetSale.AssetSaleId} at ${assetSale.TransactionCompletionDate} ` ;
        // Update buyer finds  --> decrease in value
        await ctx.stub.invokeChaincode('client', ['updateKeyValue', buyerId, JSON.stringify(buyer)],  'mychannel');
        // Update seller funds --> increase in value
        await ctx.stub.invokeChaincode('client', ['updateKeyValue', sellerId],  JSON.stringify(seller), 'mychannel');

        let buffer = Buffer.from(JSON.stringify(assetSale));
        await ctx.stub.putState(keyValueId, buffer);
        return assetSale
    
      } else {
        assetSale.Comment += `\n Buyer ${buyer.ClientName} did not have enough funds to make the transfer.`
        return assetSale;   

      }
  }     


     // Buy the Asset

     // --> Get buyer record
     // --> Get the seller record
     // --> get the Asset
     // --> Subtract the asset price from the buyer funds
     // --> Add the asset price to the seller fund
     // --> Complete and close the AssetSale object  e.g. asset id, client id, buyer id

     async crossChannelCall(ctx, contracToCall, key, value, channel) {
      // const client = 
      //   {
      //     "Number": 1,
      //     "ClientId": "2001",
      //     "DocType":"Client-Ledger",
      //     "Fund": 4500.50,
      //     "ClientName": "Client A",
      //     "Comment": "NoComment"
      //   };

        let object = JSON.parse(value);
        console.log(`Value = ${JSON.stringify(object)}`);
        
        await ctx.stub.invokeChaincode(contracToCall, ['createKeyValue', key, JSON.stringify(object)],  channel);
    }

    /**
     * Run a cross-contract call to retrieve a JSON object to be used in this contract.
     * @param {*} ctx 
     * @param {The name of the remote contract to call} contracToCall 
     * @param {The key of the value to read} key 
     * @param {The name of the channel to use} channel 
     * 
     * Return a JSON object
     */
    async crossChannelRead(ctx, contracToCall, key, channel) {
        
      const buffer = await ctx.stub.invokeChaincode(contracToCall, ['readKeyValue', key, channel]);
    
      const result = JSON.parse(buffer.toString());    
      const obj = JSON.stringify(result);
      const dataArray = JSON.parse(obj);
    /**
          * 
     * The following is a short extract showing the breakdown of the buffer returned from the invokeChaincode call.
     *  {"type":"Buffer","data":[123,34,115,116,97,116,
     * 
     * The data array contains the JSON object, but the definition does not start at the begining of the array.
     * Use the 'offset' and 'limit' values in the payload section to identify the start and end of the JSON object.
     * Use the same principle as above where the stringbuilder collects the converted ascii characters from the
     * payload.buffer.data array, then use the offest and limit values to find the start and end of the JSON definition.
     * After that, it's easy to convert it to a proper JSON object.
     * 
     * The data section breaks down further once it has been turned into a string, as shownn below. 
     * This is what the buffer looks like after it has been converted to characters
        { status: 200,
          message: '',
          payload: 
          { buffer: { type: 'Buffer', data: [Array] },
            offset: 9,
            markedOffset: -1,
            limit: 127,
            littleEndian: true,
            noAssert: false 
          }
        }

     */      
      
     // Convert the data array into characters
      dataArray.data.toString().split(',').forEach((s) => (sb.append(String.fromCharCode(parseInt(s, 10)))));
      // convert the characters to a JSON object
      const myJson = JSON.parse(sb.toString());
      sb.clear();

      // Convert the numbers in the payload.buffer.data array to ascii characters
      myJson.payload.buffer.data.toString().split(',').forEach((s) => (sb.append(String.fromCharCode(parseInt(s, 10)))));
      // Finally, convert string into a JSON object.
      const json = JSON.parse(sb.substring(myJson.payload.offset, myJson.payload.limit));        
      
        
      return json;        
    }   
    
    
    async parameterisedCrossChannelCall(ctx, contract, args, channel) {

        let client1 = JSON.parse(value);

        await ctx.stub.invokeChaincode(contract, [...args],  channel);
        
    }   
}

module.exports = AssetSaleContract;
