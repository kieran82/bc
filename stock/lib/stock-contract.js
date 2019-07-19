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
                sourceBatchQuantity: 100,
                qtyUnitMeasurement: 'Kg',
                dateProcessed: '2019-07-08',
                testResultId: '20190713',
            },
        ];

        for (let i = 0; i < newStock.length; i++) {
            newStock[i].docType = 'saleStock';
            await ctx.stub.putState(newStock[i].stockId, Buffer.from(JSON.stringify(newStock[i])));
            console.info(`Added <-->  ${newStock[i].stockId}`);
        }
        console.info('============= END : Initialise Ledger ===========');
    }    

    async stockExists(ctx, stockId) {
        const buffer = await ctx.stub.getState(stockId);
        return (!!buffer && buffer.length > 0);
    }

    async createStock(ctx, stockId, value) {
        const exists = await this.stockExists(ctx, stockId);
        if (exists) {
            throw new Error(`The stock ${stockId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
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

    async updateStock(ctx, stockId, newValue) {
        const exists = await this.stockExists(ctx, stockId);
        if (!exists) {
            throw new Error(`The stock ${stockId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(stockId, buffer);
    }

    async deleteStock(ctx, stockId) {
        const exists = await this.stockExists(ctx, stockId);
        if (!exists) {
            throw new Error(`The stock ${stockId} does not exist`);
        }
        await ctx.stub.deleteState(stockId);
    }

}

module.exports = StockContract;
