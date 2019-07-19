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
                stockId: 101,
                result: 'Safe'
            },
            {
                testResultId: 'T102',
                docType: 'testResult',
                client: 'Shanagarry',
                stockId: 102,
                result: 'Safe'
            },
        ];

        for (let i = 0; i < testResults.length; i++) {
            testResults[i].docType = 'testResult';
            await ctx.stub.putState(testResults[i].testResultId, Buffer.from(JSON.stringify(testResults[i])));
            console.info(`Added <-->  ${testResults[i].testResultId}`);
        }
        console.info('============= END : Initialise Ledger ===========');
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

}

module.exports = ProductTestsContract;
