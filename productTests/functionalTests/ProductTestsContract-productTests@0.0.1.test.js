/*
* Use this file for functional testing of your smart contract.
* Fill out the arguments and return values for a function and
* use the CodeLens links above the transaction blocks to
* invoke/submit transactions.
* All transactions defined in your smart contract are used here
* to generate tests, including those functions that would
* normally only be used on instantiate and upgrade operations.
* This basic test file can also be used as the basis for building
* further functional tests to run as part of a continuous
* integration pipeline, or for debugging locally deployed smart
* contracts by invoking/submitting individual transactions.
*/
/*
* Generating this test file will also trigger an npm install
* in the smart contract project directory. This installs any
* package dependencies, including fabric-network, which are
* required for this test file to be run locally.
*/

'use strict';

const assert = require('assert');
const fabricNetwork = require('fabric-network');
const SmartContractUtil = require('./js-smart-contract-util');
const os = require('os');
const path = require('path');

describe('ProductTestsContract-productTests@0.0.1' , () => {

    const homedir = os.homedir();
    const walletPath = path.join(homedir, '.fabric-vscode', 'wallets', 'local_fabric_wallet');
    const gateway = new fabricNetwork.Gateway();
    const wallet = new fabricNetwork.FileSystemWallet(walletPath);
    const identityName = 'admin';
    let connectionProfile;

    before(async () => {
        connectionProfile = await SmartContractUtil.getConnectionProfile();
    });

    beforeEach(async () => {

        const discoveryAsLocalhost = SmartContractUtil.hasLocalhostURLs(connectionProfile);
        const discoveryEnabled = true;

        const options = {
            wallet: wallet,
            identity: identityName,
            discovery: {
                asLocalhost: discoveryAsLocalhost,
                enabled: discoveryEnabled
            }
        };

        await gateway.connect(connectionProfile, options);
    });

    afterEach(async () => {
        gateway.disconnect();
    });

    it('initLedger', async () => {
        // TODO: Update with parameters of transaction
        const args = [];

        const response = await SmartContractUtil.submitTransaction('ProductTestsContract', 'initLedger', args, gateway); // Returns buffer of transaction return value
        // TODO: Update with return value of transaction
        // assert.equal(JSON.parse(response.toString()), undefined);
    }).timeout(10000);

    it('getAllResults', async () => {
        // TODO: Update with parameters of transaction
        const args = [];

        const response = await SmartContractUtil.submitTransaction('ProductTestsContract', 'getAllResults', args, gateway); // Returns buffer of transaction return value
        // TODO: Update with return value of transaction
        // assert.equal(JSON.parse(response.toString()), undefined);
    }).timeout(10000);

    it('productTestsExists', async () => {
        // TODO: Update with parameters of transaction
        const args = [];

        const response = await SmartContractUtil.submitTransaction('ProductTestsContract', 'productTestsExists', args, gateway); // Returns buffer of transaction return value
        // TODO: Update with return value of transaction
        // assert.equal(JSON.parse(response.toString()), undefined);
    }).timeout(10000);

    it('createProductTests', async () => {
        // TODO: Update with parameters of transaction
        const args = [];

        const response = await SmartContractUtil.submitTransaction('ProductTestsContract', 'createProductTests', args, gateway); // Returns buffer of transaction return value
        // TODO: Update with return value of transaction
        // assert.equal(JSON.parse(response.toString()), undefined);
    }).timeout(10000);

    it('readProductTests', async () => {
        // TODO: Update with parameters of transaction
        const args = [];

        const response = await SmartContractUtil.submitTransaction('ProductTestsContract', 'readProductTests', args, gateway); // Returns buffer of transaction return value
        // TODO: Update with return value of transaction
        // assert.equal(JSON.parse(response.toString()), undefined);
    }).timeout(10000);

    it('updateProductTests', async () => {
        // TODO: Update with parameters of transaction
        const args = [];

        const response = await SmartContractUtil.submitTransaction('ProductTestsContract', 'updateProductTests', args, gateway); // Returns buffer of transaction return value
        // TODO: Update with return value of transaction
        // assert.equal(JSON.parse(response.toString()), undefined);
    }).timeout(10000);

    it('deleteProductTests', async () => {
        // TODO: Update with parameters of transaction
        const args = [];

        const response = await SmartContractUtil.submitTransaction('ProductTestsContract', 'deleteProductTests', args, gateway); // Returns buffer of transaction return value
        // TODO: Update with return value of transaction
        // assert.equal(JSON.parse(response.toString()), undefined);
    }).timeout(10000);

    it('getHistoryForKey', async () => {
        // TODO: Update with parameters of transaction
        const args = [];

        const response = await SmartContractUtil.submitTransaction('ProductTestsContract', 'getHistoryForKey', args, gateway); // Returns buffer of transaction return value
        // TODO: Update with return value of transaction
        // assert.equal(JSON.parse(response.toString()), undefined);
    }).timeout(10000);

});
