/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class BatchFeedContract extends Contract {

    async initLedger(ctx) {
        const newBatchFeed = [
            {
                "Number": 1,
                "BatchId": "1001",
                "DocType":"docType",
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
                "DocType": "docType",                          
                "Vessel": "Dreadnought",
                "CatchDate": "2019-06-22",
                "LogSheetNumber": 4123,
                "LandingDate": "2019-06-24",
                "Port": "Castletownbere",
                "FAOArea": "Area1",
                "FishingGear": "Nets",
                "Comment": "NoComments",
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
                "Number": 3,
                "BatchId": "1003",    
                "DocType": "docType",                            
                "Vessel": "Dread Locks",
                "CatchDate": "2019-06-22",
                "LogSheetNumber": 412,
                "LandingDate": "2019-06-24",
                "Port": "Castletownbere",
                "FAOArea": "Area12",
                "FishingGear": "SchNets",
                "Comment": "It was tough but we managed it",
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
                "Number": 4,
                "BatchId": "1004",      
                "DocType": "docType",                          
                "Vessel": "Dreadly",
                "CatchDate": "2019-06-22",
                "LogSheetNumber": 4123,
                "LandingDate": "2019-06-24",
                "Port": "Castletownsend",
                "FAOArea": "Area10",
                "FishingGear": "Nets and Basket",
                "Comment": "Some Comments",
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
                "DocType": "docType",                           
                "Vessel": "Marie Celeste",
                "CatchDate": "2019-06-22",
                "LogSheetNumber": 4123,
                "LandingDate": "2019-06-24",
                "Port": "Castletownbere",
                "FAOArea": "Area 13",
                "FishingGear": "Nets",
                "Comment": "We did it",
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
                "Number": 6,
                "BatchId": "1006",  
                "DocType": "docType",                             
                "Vessel": "N/A",
                "CatchDate": "2019-06-22",
                "LogSheetNumber": "N/A",
                "LandingDate": "2019-06-24",
                "Port": "N/A",
                "FAOArea": "N/A",
                "FishingGear": "N/A",
                "Comment": "Tally Ho",
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

        for (let i = 0; i < newBatchFeed.length; i++) {
            newBatchFeed[i].DocType = 'ErrigalBatchFeed';
            await ctx.stub.putState(newBatchFeed[i].BatchId, Buffer.from(JSON.stringify(newBatchFeed[i])));
        }
    }

    // Custom Code

    /**
     * 
     * @param {The contract to use} ctx 
     * @param {An array of batch objects. There is currently no size limit
     *  for this array, but some limit should be set. We will have to see how badly performance 
     *  is affected.} newBatchFeed 
     */
    async saveArray(ctx, strArray){
        const newBatchFeed = JSON.parse(strArray);
        
        for (let i = 0; i < newBatchFeed.length; i++) {
            await ctx.stub.putState(newBatchFeed[i].BatchId, Buffer.from(JSON.stringify(newBatchFeed[i])));      
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
     * @param {The BatchId value, which is the key for the block} batchId 
     */
    async getHistoryForKey(ctx, batchId) {
        const exists = await this.batchFeedExists(ctx, batchId);

        if (!exists) {
            throw new Error(`The Stock ID of ${batchId} does not exist`);
        }

        let resultsIterator = await ctx.stub.getHistoryForKey(batchId);
        let results = await this.getAllResults(resultsIterator, true);

        return Buffer.from(JSON.stringify(results));
    }

    /**
     * 
     * @param {The name of the contract} ctx 
     * @param {The BatchId for the start of the range} startId 
     * @param {The BatchId beyond the end of the search range i.e. not included in result} endId 
     */
    async getStateByRange(ctx, startId, endId) {
        const exists = await this.batchFeedExists(ctx, startId);

        if (!exists) {
            throw new Error(`The Stock ID of ${startId} does not exist`);
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
     * @param {The BatchId, which is the key} batchFeedId
     */
    async batchFeedExists(ctx, batchFeedId) {
        const buffer = await ctx.stub.getState(batchFeedId);
        return (!!buffer && buffer.length > 0);
    }

    /**
     * 
     * @param {The name of the contract} ctx 
     * @param {The BatchId, which is the key} batchFeedId 
     * @param {The JSON object which is stored in the ledger} value 
     */
    async createBatchFeed(ctx, batchFeedId, value) {
        const exists = await this.batchFeedExists(ctx, batchFeedId);
        if (exists) {
            throw new Error(`The batch feed ${batchFeedId} already exists`);
        }

        const buffer = Buffer.from(value);
        await ctx.stub.putState(batchFeedId, buffer);
    }

    /**
     * 
     * @param {The name of the contract} ctx 
     * @param {The BatchId value, which is the key} batchFeedId 
     */
    async readBatchFeed(ctx, batchFeedId) {
        const exists = await this.batchFeedExists(ctx, batchFeedId);
        if (!exists) {
            throw new Error(`The batch feed ${batchFeedId} does not exist`);
        }
        const buffer = await ctx.stub.getState(batchFeedId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    /**
     * 
     * @param {The name of the contract} ctx 
     * @param {The BatchId value, which is the key} batchFeedId
     * @param {The updated block to save to the ledger} newValue 
     */
    async updateBatchFeed(ctx, batchFeedId, newValue) {
        const exists = await this.batchFeedExists(ctx, batchFeedId);
        
        if (!exists) {
            throw new Error(`The batch feed ${batchFeedId} does not exist`);
        }

        const buffer = Buffer.from(newValue);
        await ctx.stub.putState(batchFeedId, buffer);
    }

    /**
     *
     * @param {The name of the contract} ctx
     * @param {The BatchId value, which is the key} batchFeedId
     */
    async deleteBatchFeed(ctx, batchFeedId) {
        const exists = await this.batchFeedExists(ctx, batchFeedId);
        if (!exists) {
            throw new Error(`The batch feed ${batchFeedId} does not exist`);
        }
        await ctx.stub.deleteState(batchFeedId);
    }

}

module.exports = BatchFeedContract;
