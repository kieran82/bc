'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

console.log(__dirname);

// capture network variables from config.json
const configPath = path.join(process.cwd(), './config.json');
console.log(`Config path is ${configPath} from web client`);
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
var connection_file = config.connection_file;
var userName = config.userName;
var gatewayDiscovery = config.gatewayDiscovery;

// connect to the connection file
const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

console.log(`Connection file is ${connection_file} `);

/* ===============================  Test Methods ====================================== */
// Common method to get a Wallet
const getWallet = () => {
  const walletPath = path.join(process.cwd(), '/wallet');
  const wallet = new FileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);
  return wallet;

}

exports.rawMaterialExists = async (batchId) => {

  try {
    const wallet = getWallet();
    const exists = await wallet.exists(userName);

    console.log(`This is the batch ID ${batchId}`);

    if (!exists) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);
      return;
    }

    // Get the contract from the network.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
    const network = await gateway.getNetwork('channel1');
    const contract = network.getContract('rawmaterials');

    // Submit the specified transaction.
    const retVal = await contract.submitTransaction('rawmaterialExists', batchId);
    console.log(`Return value is ${retVal}`);

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit Order transaction: ${error}`);
  }

}

exports.createRawMaterial = async (batchId, value) => {
  try {
    const wallet = getWallet();
    const exists = await wallet.exists(userName);

    console.log(`This is the batch ID ${batchId}`);
    
    if (!exists) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);
      return;
    }

    // Get the contract from the network.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
    const network = await gateway.getNetwork('channel1');
    const contract = network.getContract('rawmaterials');

    // Submit the specified transaction.
    await contract.submitTransaction('createRawmaterial', batchId, value);
    console.log(`Raw Material transaction has been submitted`);

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit Raw Material transaction: ${error}`);
  }
}

exports.updateRawMaterial = async (batchId, value) => {
  try {

    const wallet = getWallet();
    const exists = await wallet.exists(userName);

    console.log(`This is the batch ID ${batchId}`);

    if (!exists) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);
      return;
    }

    // Get the contract from the network.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
    const network = await gateway.getNetwork('channel1');
    const contract = network.getContract('rawmaterials');

    await contract.submitTransaction('updateRawmaterial', batchId, value);
    console.log('Transaction has been submitted');

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
  }
}

exports.readRawMaterial = async (batchId) => {

  try {

    const wallet = getWallet();
    const exists = await wallet.exists(userName);

    console.log(`This is the batch ID ${batchId}`);

    if (!exists) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);
      return;
    }

    // Get the contract from the network.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
    const network = await gateway.getNetwork('channel1');
    const contract = network.getContract('rawmaterials');

    // Submit the specified transaction.
    const result = await contract.evaluateTransaction('readRawmaterial', batchId);
    console.log(`Transaction has been submitted:\n ${result}`);

    // Disconnect from the gateway.
    await gateway.disconnect();

    return result;

  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
  }
}

exports.deleteRawMaterial = async (batchId) => {
  try {
    const wallet = getWallet();
    const exists = await wallet.exists(userName);

    if (!exists) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);
      return;
    }

    // Get the contract from the network.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
    const network = await gateway.getNetwork('channel1');
    const contract = network.getContract('rawmaterials');

    // Submit the specified transaction.
    await contract.submitTransaction('deleteRawmaterial', batchId);
    console.log(`Asset ${batchId} has been deleted`);

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
  }
}



