/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class OrderContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialise Ledger ===========');

        const orders = [
            {
                orderId: '1001',
                docType: 'foodOrder',
                despatchDate: '2019-07-20',
                dateReceived: '2019-07-20',
                buyerId: '0001',
                quantity: 750,
                qtyUnitMeasurement: 'Kg',
                processUsed: 'Smoking',
                orderLines: [
                    { orderLine: 1, sourceBatchId: '101', tested: 'Yes', quantity: 500, qtyUnitMeasurement: 'Kg'},
                    { orderLine: 2, sourceBatchId: '102', tested: 'Yes', quantity: 250, qtyUnitMeasurement: 'Kg'},
                ],
            },
            {
                orderId: '1002',
                docType: 'foodOrder',
                despatchDate: '2019-07-20',
                dateReceived: '2019-07-21',
                buyerId: '0002',
                quantity: 500,
                qtyUnitMeasurement: 'Kg',
                orderLines: [
                    { orderLine: 1, sourceBatchId: '102', tested: 'Yes', testDate: '07/06/2019', quantity: 400, qtyUnitMeasurement: 'Kg'},
                    { orderLine: 2, sourceBatchId: '1023', tested: 'Yes', testDate: '08/06/2019', quantity: 100, qtyUnitMeasurement: 'Kg'},
                ],
            },
        ];

        for (let i = 0; i < orders.length; i++) {
            orders[i].docType = 'foodOrder';
            await ctx.stub.putState(orders[i].orderId, Buffer.from(JSON.stringify(orders[i])));
            console.info(`Added <-->  ${orders[i].orderId}`);
        }
        console.info('============= END : Initialise Ledger ===========');
    }

    async foodOrderExists(ctx, orderId) {
        const buffer = await ctx.stub.getState(orderId);
        return (!!buffer && buffer.length > 0);
    }    

    async orderExists(ctx, orderId) {
        const buffer = await ctx.stub.getState(orderId);
        return (!!buffer && buffer.length > 0);
    }

    async createOrder(ctx, orderId, value) {
        const exists = await this.orderExists(ctx, orderId);
        if (exists) {
            throw new Error(`The order ${orderId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(orderId, buffer);
    }

    async readOrder(ctx, orderId) {
        const exists = await this.orderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }
        const buffer = await ctx.stub.getState(orderId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateOrder(ctx, orderId, newValue) {
        const exists = await this.orderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(orderId, buffer);
    }

    async deleteOrder(ctx, orderId) {
        const exists = await this.orderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }
        await ctx.stub.deleteState(orderId);
    }

}

module.exports = OrderContract;
