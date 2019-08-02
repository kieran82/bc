/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class BatchContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialise Ledger ===========');

        const batchContract = [
            {
                batchId: '1001',
                docType: 'batchAsset',
                certified: 'Yes',
                supplierId: '0001',
                quantity: 1000,
                qtyUnitMeasurement: 'Kg',
                processUsed: 'Smoking',
                stockLevel: 1000,
                waste: 0
            },
            {
                batchId: '1002',
                docType: 'batchAsset',
                certified: 'Yes',
                supplierId: '0002',
                quantity: 1000,
                qtyUnitMeasurement: 'Kg',
                processUsed: 'Smoking',
                stockLevel: 1000,
                waste: 0
            },
        ];

        for (let i = 0; i < batchContract.length; i++) {
            batchContract[i].docType = 'testResult';
            await ctx.stub.putState(batchContract[i].batchId, Buffer.from(JSON.stringify(batchContract[i])));
            console.info(`Added <-->  ${batchContract[i].batchId}`);
        }
        console.info('============= END : Initialise Ledger ===========');
    }    


    async batchExists(ctx, batchId) {
        const buffer = await ctx.stub.getState(batchId);
        return (!!buffer && buffer.length > 0);
    }

    async createBatch(ctx, batchId, value) {
        const exists = await this.batchExists(ctx, batchId);
        if (exists) {
            throw new Error(`The batch ${batchId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(batchId, buffer);
    }

    async readBatch(ctx, batchId) {
        const exists = await this.batchExists(ctx, batchId);
        if (!exists) {
            throw new Error(`The batch ${batchId} does not exist`);
        }
        const buffer = await ctx.stub.getState(batchId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateBatch(ctx, batchId, newValue) {
        const exists = await this.batchExists(ctx, batchId);
        if (!exists) {
            throw new Error(`The batch ${batchId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(batchId, buffer);
    }

    async deleteBatch(ctx, batchId) {
        const exists = await this.batchExists(ctx, batchId);
        if (!exists) {
            throw new Error(`The batch ${batchId} does not exist`);
        }
        await ctx.stub.deleteState(batchId);
    }

}

module.exports = BatchContract;
