/* eslint-disable quotes */
/* eslint-disable no-constant-condition */
/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Contract } = require("fabric-contract-api");

class OrderContract extends Contract {
    async initLedger(ctx) {
        console.info("============= START : Initialise Ledger ===========");

        const orders = [
            {
                orderId: "1001",
                docType: "foodOrder",
                despatchDate: "2019-07-20",
                dateReceived: "2019-07-20",
                buyerId: "0001",
                quantity: 750,
                qtyUnitMeasurement: "Kg",
                processUsed: "Smoking",
                orderLines: [
                    {
                        orderLine: 1,
                        sourceBatchId: "101",
                        tested: "Yes",
                        quantity: 500,
                        qtyUnitMeasurement: "Kg"
                    },
                    {
                        orderLine: 2,
                        sourceBatchId: "102",
                        tested: "Yes",
                        quantity: 250,
                        qtyUnitMeasurement: "Kg"
                    }
                ]
            },
            {
                orderId: "1002",
                docType: "foodOrder",
                despatchDate: "2019-07-20",
                dateReceived: "2019-07-21",
                buyerId: "0002",
                quantity: 500,
                qtyUnitMeasurement: "Kg",
                orderLines: [
                    {
                        orderLine: 1,
                        sourceBatchId: "102",
                        tested: "Yes",
                        testDate: "07/06/2019",
                        quantity: 400,
                        qtyUnitMeasurement: "Kg"
                    },
                    {
                        orderLine: 2,
                        sourceBatchId: "1023",
                        tested: "Yes",
                        testDate: "08/06/2019",
                        quantity: 100,
                        qtyUnitMeasurement: "Kg"
                    }
                ]
            }
        ];

        for (let i = 0; i < orders.length; i++) {
            orders[i].docType = "foodOrder";
            await ctx.stub.putState(
                orders[i].orderId,
                Buffer.from(JSON.stringify(orders[i]))
            );
            console.info(`Added <-->  ${orders[i].orderId}`);
        }
        console.info("============= END : Initialise Ledger ===========");
    }

    async getAllResults(iterator, isHistory) {
        let allResults = [];
        while (true) {
            let res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString("utf8"));

                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.tx_id;
                    jsonRes.Timestamp = res.value.timestamp;
                    jsonRes.IsDelete = res.value.is_delete.toString();
                    try {
                        jsonRes.Value = JSON.parse(
                            res.value.value.toString("utf8")
                        );
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString("utf8");
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(
                            res.value.value.toString("utf8")
                        );
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString("utf8");
                    }
                }
                allResults.push(jsonRes);
            }

            if (res.done) {
                console.log("end of data");
                await iterator.close();
                console.info(allResults);
                return allResults;
            }
        }
    }

    async foodOrderExists(ctx, orderId) {
        const buffer = await ctx.stub.getState(orderId);
        return !!buffer && buffer.length > 0;
    }

    async orderExists(ctx, orderId) {
        const buffer = await ctx.stub.getState(orderId);
        return !!buffer && buffer.length > 0;
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
