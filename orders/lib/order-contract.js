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
            await ctx.stub.putState(newBatchFeed[i].orderId, Buffer.from(JSON.stringify(newBatchFeed[i])));      
        }    
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
    
    /**
     * 
     * @param {The name of the contract} ctx 
     * @param {The BatchId for the start of the range} startId 
     * @param {The BatchId beyond the end of the search range i.e. not included in result} endId 
     */
    async getStateByRange(ctx, startId, endId) {
        const exists = await this.orderExists(ctx, startId);

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

        let buffer = Buffer.from(value);    
        await ctx.stub.putState(orderId, buffer);
        
        let order = JSON.parse(buffer.toString());

        let orderEvent = {
            type: "New Order",
            ownerId: order.buyerId,
            id: order.orderId,
            description: order.processUsed,
            status: "Saved...",
            amount: order.quantity,
            orderLines: order.orderLines
        };          

        await ctx.stub.setEvent('orderEvent', Buffer.from(JSON.stringify(orderEvent)));        
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

    async updateOrder(ctx, orderId, value) {

        const exists = await this.orderExists(ctx, orderId);
        
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }
        
        const buffer = Buffer.from(value);
        await ctx.stub.putState(orderId, buffer); 

        let order = JSON.parse(buffer.toString());        

        // define and set orderEvent
        let orderEvent = {
            type: 'Order Update',
            ownerId: order.buyerId,
            id: order.orderId,
            description: order.processUsed,
            status: "Updated...",
            amount: order.quantity,
            orderLines: order.orderLines
        };
        
        await ctx.stub.setEvent('orderEvent', Buffer.from(JSON.stringify(orderEvent)));            
    }


    async deleteOrder(ctx, orderId) {
        const exists = await this.orderExists(ctx, orderId);
        if (!exists) {
            throw new Error(`The order ${orderId} does not exist`);
        }
        await ctx.stub.deleteState(orderId);
    }

    async getHistoryForKey(ctx, orderId) {
        const exists = await this.orderExists(ctx, orderId);

        if (!exists) {
            throw new Error(`The Order number ${orderId} does not exist`);
        }

        let resultsIterator = await ctx.stub.getHistoryForKey(orderId);
        // let method = thisClass['getAllResults'];
        let results = await this.getAllResults(resultsIterator, true);

        // const buffer = await ctx.stub.getHistoryForKey(orderId);      
        // const asset = JSON.parse(buffer.toString());
        return Buffer.from(JSON.stringify(results));
    }       

}

module.exports = OrderContract;
