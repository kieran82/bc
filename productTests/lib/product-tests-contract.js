/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ProductTestsContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialise Ledger ===========');

        const testResults = [
            {
                testResultId: 'T101',
                docType: 'testResult',
                client: 'Shanagarry',
                typeOfTest: 'micro',
                result: '123'
            },
            {
                testResultId: 'T102',
                docType: 'testResult',
                client: 'GarryShanny',
                typeOfTest: 'fungal',
                result: '123'
            },
        ];

        for (let i = 0; i < testResults.length; i++) {
            testResults[i].docType = 'testResult';
            await ctx.stub.putState(testResults[i].testResultId, Buffer.from(JSON.stringify(testResults[i])));
            console.info(`Added <-->  ${testResults[i].testResultId}`);
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

    async productTestsExists(ctx, productTestsId) {
        const buffer = await ctx.stub.getState(productTestsId);
        return (!!buffer && buffer.length > 0);
    }

    async createProductTests(ctx, productTestsId, value) {
        const exists = await this.productTestsExists(ctx, productTestsId);
        if (exists) {
            throw new Error(`The product tests ${productTestsId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(productTestsId, buffer);
    }

    async readProductTests(ctx, productTestsId) {
        const exists = await this.productTestsExists(ctx, productTestsId);
        if (!exists) {
            throw new Error(`The product tests ${productTestsId} does not exist`);
        }
        const buffer = await ctx.stub.getState(productTestsId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateProductTests(ctx, productTestsId, newValue) {
        const exists = await this.productTestsExists(ctx, productTestsId);
        if (!exists) {
            throw new Error(`The product tests ${productTestsId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(productTestsId, buffer);
    }

    async deleteProductTests(ctx, productTestsId) {
        const exists = await this.productTestsExists(ctx, productTestsId);
        if (!exists) {
            throw new Error(`The product tests ${productTestsId} does not exist`);
        }
        await ctx.stub.deleteState(productTestsId);
    }

    async getHistoryForKey(ctx, productTestsId) {
        const exists = await this.productTestsExists(ctx, productTestsId);

        if (!exists) {
            throw new Error(`The product tests ${productTestsId} does not exist`);
        }

        let resultsIterator = await ctx.stub.getHistoryForKey(productTestsId);  
        // let method = thisClass['getAllResults'];
        let results = await this.getAllResults(resultsIterator, true);        

        // const buffer = await ctx.stub.getHistoryForKey(productTestsId);      
        // const asset = JSON.parse(buffer.toString());
        return Buffer.from(JSON.stringify(results)); 
    }

}

module.exports = ProductTestsContract;
