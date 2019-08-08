/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const fs = require("fs");
const path = require("path");

const network = require("./network");

const order = 
  {
    "orderId": "1007",
    "docType": "foodOrder",
    "despatchDate": "2019-07-20",
    "dateReceived": "2019-07-20",
    "buyerId": "1001",
    "quantity": 750,
    "qtyUnitMeasurement": "Kg",
    "processUsed": "Smoking Dude",
    "orderLines": [
      {
      "orderLine": 1, "sourceBatchId": "101", "tested": "Yes", "quantity": 500, "qtyUnitMeasurement": "Kg" },
      { "orderLine": 2, "sourceBatchId": "102", "tested": "Yes", "quantity": 250, "qtyUnitMeasurement": "Kg" },
    ],
  };

// network.foodOrderExists("1001")  ;

// network.createOrder(order.orderId, JSON.stringify(order));

// network.updateOrder(order.orderId, JSON.stringify(order));

// network.readOrder(order.orderId);

network.deleteOrder("1001");