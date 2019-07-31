/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class RawmaterialContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialise Ledger ===========');

        const rawBatch = [
            {
                batchId: '1001',
                docType: 'materials',
                certified: 'Yes',
                supplierId: '0001',
                quantity: 1000,
                qtyUnitMeasurement: 'Kg',
                product: 'Organic Salmon',
                dateReceived: '2019-07-07'
            },
            {
                batchId: '1002',
                docType: 'materials',
                certified: 'N/A',
                supplierId: '0001',
                quantity: 1150,
                qtyUnitMeasurement: 'Kg',
                product: 'Wood Shavings',
                dateReceived: '2019-07-07'
            },
        ];

        for (let i = 0; i < rawBatch.length; i++) {
            rawBatch[i].docType = 'materials';
            await ctx.stub.putState(rawBatch[i].batchId, Buffer.from(JSON.stringify(rawBatch[i])));
            console.info(`Added <-->  ${rawBatch[i].batchId}`);
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

    async rawmaterialExists(ctx, rawmaterialId) {
        const buffer = await ctx.stub.getState(rawmaterialId);
        return (!!buffer && buffer.length > 0);
    }

    async createRawmaterial(ctx, rawmaterialId, value) {
        const exists = await this.rawmaterialExists(ctx, rawmaterialId);
        if (exists) {
            throw new Error(`The rawmaterial ${rawmaterialId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(rawmaterialId, buffer);
    }

    async readRawmaterial(ctx, rawmaterialId) {
        const exists = await this.rawmaterialExists(ctx, rawmaterialId);
        if (!exists) {
            throw new Error(`The rawmaterial ${rawmaterialId} does not exist`);
        }
        const buffer = await ctx.stub.getState(rawmaterialId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateRawmaterial(ctx, rawmaterialId, newValue) {
        const exists = await this.rawmaterialExists(ctx, rawmaterialId);
        if (!exists) {
            throw new Error(`The rawmaterial ${rawmaterialId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(rawmaterialId, buffer);
    }

    async deleteRawmaterial(ctx, rawmaterialId) {
        const exists = await this.rawmaterialExists(ctx, rawmaterialId);
        if (!exists) {
            throw new Error(`The rawmaterial ${rawmaterialId} does not exist`);
        }
        await ctx.stub.deleteState(rawmaterialId);
    }

    async getHistoryForKey(ctx, rawmaterialId) {
        const exists = await this.rawmaterialExists(ctx, rawmaterialId);

        if (!exists) {
            throw new Error(`The product tests ${rawmaterialId} does not exist`);
        }

        let resultsIterator = await ctx.stub.getHistoryForKey(rawmaterialId);
        // let method = thisClass['getAllResults'];
        let results = await this.getAllResults(resultsIterator, true);

        // const buffer = await ctx.stub.getHistoryForKey(rawmaterialId);      
        // const asset = JSON.parse(buffer.toString());
        return Buffer.from(JSON.stringify(results));
    }    

}

module.exports = RawmaterialContract;
