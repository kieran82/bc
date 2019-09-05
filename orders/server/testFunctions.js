/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const fs = require("fs");
const path = require("path");
const StringBuilder = require('node-stringbuilder');
const sb = new StringBuilder();

const network = require("./network");

const order = 
  {
    "orderId": "1005",
    "docType": "foodOrder",
    "despatchDate": "2019-07-20",
    "dateReceived": "2019-07-20",
    "buyerId": "1001",
    "quantity": 752,
    "qtyUnitMeasurement": "Kg",
    "processUsed": "Smoking Hot Dude",
    "orderLines": [
      {
      "orderLine": 1, "sourceorderId": "101", "tested": "Yes", "quantity": 500, "qtyUnitMeasurement": "Kg" },
      { "orderLine": 2, "sourceorderId": "102", "tested": "Yes", "quantity": 250, "qtyUnitMeasurement": "Kg" },
    ],
  };

const testy = async () => {

  const res = await network.getHistoryForKey(order.orderId);

  let allResults = "";
  const js = JSON.parse(res);
  //Convert the array of ASCII values into a character string
  js.data.toString().split(',').forEach((s) => (sb.append(String.fromCharCode(parseInt(s, 10)))));
  //Parse the string back into a JSON object
  const myJson = JSON.parse(sb.toString());

  //Now all items in the history object array can be accessed
  for (var myKey in myJson) {
    // console.log(myJson[myKey].Value);
    const dt = new Date(parseInt(myJson[myKey].Timestamp.seconds.low) * 1000);
    // console.log(myJson[myKey].Timestamp.seconds.low);
    console.log(dt.toISOString());

    console.log("--------------------------------------------------------------------");

  }

}

testy();


// network.foodOrderExists("1001")  ;

// network.createOrder(order.orderId, JSON.stringify(order));

// network.updateOrder(order.orderId, JSON.stringify(order));

// network.readOrder(order.orderId);

// network.deleteOrder("1001");