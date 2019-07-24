/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');

const network = require('./network');

const rawMaterialIn = 
  {
    batchId: '1003',
    docType: 'materials',
    certified: 'Ya Baby!',
    supplierId: '0001',
    quantity: 100,
    qtyUnitMeasurement: 'Kg',
    product: 'Organically Salmony',
    dateReceived: '2019-07-07',
  };

// network.rawMaterialExists("1001")  ;

// network.createRawMaterial(rawMaterialIn.batchId, JSON.stringify(rawMaterialIn));

// network.updateRawMaterial(rawMaterialIn.batchId, JSON.stringify(rawMaterialIn));

network.readRawMaterial(rawMaterialIn.batchId);

// network.deleteRawMaterial(rawMaterialIn.batchId);