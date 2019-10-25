/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class StockContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialise Ledger ===========');

        const newStock = [
            {
                stockId: '101',
                docType: 'stockLevel',
                sourceBatchId: 1001,
                supplierId: '0001',
                sourceBatchQuantity: 100,
                qtyUnitMeasurement: 'Kg',
                dateProcessed: '2019-07-08',
                testResultId: '20190710',
            },
            {
                stockId: '102',
                docType: 'stockLevel',
                sourceBatchId: 1001,
                supplierId: '0001',
                sourceBatchQuantity: 500,
                qtyUnitMeasurement: 'Kg',
                dateProcessed: '2019-08-08',
                testResultId: '20190813',
            },
            {
                stockId: '103',
                docType: 'stockLevel',
                sourceBatchId: 1002,
                supplierId: '0001',
                sourceBatchQuantity: 600,
                qtyUnitMeasurement: 'Kg',
                dateProcessed: '2019-09-08',
                testResultId: '20190913',
            },
            {
                stockId: '104',
                docType: 'stockLevel',
                sourceBatchId: 1003,
                supplierId: '0001',
                sourceBatchQuantity: 300,
                qtyUnitMeasurement: 'Kg',
                dateProcessed: '2019-10-01',
                testResultId: '20191010',
            },                        
        ];

        for (let i = 0; i < newStock.length; i++) {
            newStock[i].docType = 'saleStock';
            await ctx.stub.putState(newStock[i].stockId, Buffer.from(JSON.stringify(newStock[i])));
            console.info(`Added <-->  ${newStock[i].stockId}`);
        }
        console.info('============= END : Initialise Ledger ===========');
    }    

    async getAllResults(iterator, isHistory) {
        let allResults = [];
        while (true) {
            let res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));

                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.tx_id;
                    jsonRes.Timestamp = res.value.timestamp;
                    jsonRes.IsDelete = res.value.is_delete.toString();
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }

            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
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

    async stockExists(ctx, stockId) {
        const buffer = await ctx.stub.getState(stockId);
        return (!!buffer && buffer.length > 0);
    }

    /**
     * 
     * @param {Name of the contract} ctx 
     * @param {The ID of the stock item} stockId 
     * @param {The stock object as a JSON string} value 
     */
    async createStock(ctx, stockId, value) {
        const exists = await this.stockExists(ctx, stockId);
        if (exists) {
            throw new Error(`The stock ${stockId} already exists`);
        }

        const buffer = Buffer.from(value);
        await ctx.stub.putState(stockId, buffer);
    }

    async readStock(ctx, stockId) {
        const exists = await this.stockExists(ctx, stockId);
        if (!exists) {
            throw new Error(`The stock ${stockId} does not exist`);
        }
        const buffer = await ctx.stub.getState(stockId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    /**
     * 
     * @param {Name of the contract} ctx
     * @param {The ID of the stock item being updated} stockId
     * @param {The new version of the stock object as a JSON string} value
     */
    async updateStock(ctx, stockId, newValue) {
        const exists = await this.stockExists(ctx, stockId);
        if (!exists) {
            throw new Error(`The stock ${stockId} does not exist`);
        }
        const buffer = Buffer.from(newValue);
        await ctx.stub.putState(stockId, buffer);
    }

    async deleteStock(ctx, stockId) {
        const exists = await this.stockExists(ctx, stockId);
        if (!exists) {
            throw new Error(`The stock ${stockId} does not exist`);
        }
        await ctx.stub.deleteState(stockId);
    }

    /** Range Queries */
    async getHistoryForKey(ctx, stockId) {
        const exists = await this.stockExists(ctx, stockId);

        if (!exists) {
            throw new Error(`The Stock ID of ${stockId} does not exist`);
        }

        let resultsIterator = await ctx.stub.getHistoryForKey(stockId);
        let results = await this.getAllResults(resultsIterator, true);

        return Buffer.from(JSON.stringify(results));
    }    

    async getStateByRange(ctx, startId, endId) {
        const exists = await this.stockExists(ctx, startId);

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

}

module.exports = StockContract;
