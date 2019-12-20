/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const AssetSaleContract = require('./assetSaleContract');
const ClientContract = require('./clientContract');
const AssetContract = require('./assetContract');

module.exports.AssetSaleContract = AssetSaleContract;
module.exports.contracts = [ AssetSaleContract ];

module.exports.ClientContract = ClientContract;
module.exports.clients = [ ClientContract ];

module.exports.AssetContract = AssetContract;
module.exports.assets = [ AssetContract ];
