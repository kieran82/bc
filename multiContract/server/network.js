'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const StringBuilder = require('node-stringbuilder');
const sb = new StringBuilder();
const fs = require('fs');
const path = require('path');

console.log(__dirname);

// capture network variables from config.json
const configPath = path.join(process.cwd(), './config.json');
// console.log(`Config path is ${configPath} from web client`);
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
var connection_file = config.connection_file;
var userName = config.userName;
var gatewayDiscovery = config.gatewayDiscovery;
const theWallet = config.wallet;
const theChannel = config.channel;

// console.log(`The wallet folder is ${theWallet}`);


// connect to the connection file
const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// console.log(`Connection file is ${connection_file} `);

/* ===============================  Test Methods ====================================== */
// Common method to get a Wallet
const getWallet = () => {
  const walletPath = path.join(process.cwd(), theWallet);
  const wallet = new FileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);
  return wallet;

}

//
exports.keyExists = async (contractName, func, keyID) => {

  try {
    const wallet = getWallet();
    const exists = await wallet.exists(userName);

    console.log(`This is the key ID ${keyID}`);
    console.log(`This is the contract being used ${contractName}`);

    if (!exists) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);
      return;
    }

    // Get the contract from the network.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
    const network = await gateway.getNetwork(theChannel);
    const contract = network.getContract(contractName);

    // Submit the specified transaction.
    const retVal = await contract.submitTransaction(func, keyID);
    console.log(`Return value is ${retVal}`);

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit keyExists transaction: ${error}`);
  }

}

exports.parameterisedCrossChannelCall = async (contractName, func, valueArray, channel) => {
  try {
    const wallet = getWallet();
    const exists = await wallet.exists(userName);
    const values = [];

    const client = 
    {
      "Number": 7,
      "ClientId": "1007",  
      "DocType": "Client-Ledger",                             
      "Comment": "Hello there client! Tally Ho",
      "Funds": 5000          
    };   

    values.push('createKeyValue');
    values.push(client.ClientId);
    values.push(JSON.stringify(client));

    console.log(`This is the func name ${func}`);

    if (!exists) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);
      return;
    }

    // Get the contract from the network.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
    const network = await gateway.getNetwork(theChannel);
    const contract = network.getContract(contractName);

    // Submit the specified transaction.
    await contract.submitTransaction(func, values, channel);
    console.log(`Transaction has been submitted`);

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit createKeyValue transaction: ${error}`);
  }    
}


exports.createKeyValue = async (contractName, func, keyID, value) => {
  try {
    const wallet = getWallet();
    const exists = await wallet.exists(userName);

    console.log(`This is the Key ID ${keyID}`);

    if (!exists) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);
      return;
    }

    // Get the contract from the network.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
    const network = await gateway.getNetwork(theChannel);
    const contract = network.getContract(contractName);

    // Submit the specified transaction.
    await contract.submitTransaction(func, keyID, value);
    console.log(`Transaction has been submitted`);

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit createKeyValue transaction: ${error}`);
  }
}


exports.updateKeyValue = async (contractName, func, keyID, value) => {
  try {

    const wallet = getWallet();
    const exists = await wallet.exists(userName);

    console.log(`This is the Key ID ${keyID}`);

    if (!exists) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);
      return;
    }

    // Get the contract from the network.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
    const network = await gateway.getNetwork(theChannel);
    const contract = network.getContract(contractName);

    await contract.submitTransaction(func, keyID, value);
    console.log('Transaction has been submitted');

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
  }
}

exports.deleteKeyValue = async (contractName, func, keyID) => {
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
    const network = await gateway.getNetwork(theChannel);
    const contract = network.getContract(contractName);

    // Submit the specified transaction.
    await contract.submitTransaction(func, keyID);
    console.log(`Item key ${keyID} has been deleted`);

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
  }
}


exports.getHistoryForKey = async (contractName, func, keyID) => {
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
    const network = await gateway.getNetwork(theChannel);
    const contract = network.getContract(contractName);

    // Submit the specified transaction.
    const result = await contract.submitTransaction(func, keyID);
    // console.log(`Transaction has been submitted:\n ${result}`);

    // Disconnect from the gateway.
    await gateway.disconnect();

    return result;

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
  }
}

exports.getStateByRange = async (contractName, func, startId, endId) => {
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
    const network = await gateway.getNetwork(theChannel);
    const contract = network.getContract(contractName);

    // Submit the specified transaction.
    const result = await contract.submitTransaction(func, startId, endId);

    // Disconnect from the gateway.
    await gateway.disconnect();
    // Returning the raw result here and letting the client software handle the buffer.
    return result;

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
  }
}

exports.readKeyValue = async (contractName, func, keyID) => {

  try {

    const wallet = getWallet();
    const exists = await wallet.exists(userName);

    console.log(`This is the Key ID ${keyID}`);

    if (!exists) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);
      return;
    }

    // Get the contract from the network.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
    const network = await gateway.getNetwork(theChannel);
    const contract = network.getContract(contractName);

    // Submit the specified transaction.
    const result = await contract.evaluateTransaction(func, keyID);
    console.log(`Transaction has been submitted:\n ${result}`);

    // Disconnect from the gateway.
    await gateway.disconnect();

    return result;

  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
  }
}


exports.exchangeAsset = async (contractName, func, assetId, buyerId) => {

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
    const network = await gateway.getNetwork(theChannel);
    const contract = network.getContract(contractName);

    // Submit the specified transaction.
    console.log(`This is the AssetId ${assetId}`);
    console.log(`This is the Buyer ID ${buyerId}`);
    
    
    // const result = await contract.evaluateTransaction('readKeyValue', assetId);
    const result = await contract.evaluateTransaction(func, assetId, buyerId);
    console.log(`Transaction has been submitted:\n ${result}`);
    

    // Disconnect from the gateway.
    await gateway.disconnect();
    // Returning the raw result here and letting the client software handle the buffer.
    return result;

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
  }
}

exports.crossChannelCall = async (contractName, func, key, value, otherContract)  => {
  try {
    const wallet = getWallet();
    const exists = await wallet.exists(userName);

    console.log(`This is the func name ${func}`);

    if (!exists) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);
      return;
    }

    // Get the contract from the network.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
    const network = await gateway.getNetwork(theChannel);
    const contract = network.getContract(contractName);

    // Submit the specified transaction.
    console.log(`Hello to the world!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111 ${theChannel} and contract ${contractName}`);
    console.log(`The func is ${func} and key ${key} and value ${value}`);
    
    
    await contract.submitTransaction(func, otherContract, key, value, theChannel);
    console.log(`Transaction has been submitted`);

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit createKeyValue transaction: ${error}`);
  }  
}

exports.crossChannelRead = async (contractName, func, key, otherContract) => {

  try {
    const wallet = getWallet();
    const exists = await wallet.exists(userName);

    console.log(`This is the func name ${func}`);

    if (!exists) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);
      return;
    }

    // Get the contract from the network.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
    const network = await gateway.getNetwork(theChannel);
    const contract = network.getContract(contractName);

    // Submit the specified transaction.
    // console.log(`Hello to the world!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111 ${theChannel} and contract ${contractName}`);
    // console.log(`The func is ${func} and key ${key} and value ${value}`);
    /**
     * { status: 200,
  message: '',
  payload: 
   { buffer: { type: 'Buffer', data: [Array] },
     offset: 9,
     markedOffset: -1,
     limit: 127,
     littleEndian: true,
     noAssert: false } }
     */
    
    
    // let result = {};
    const result = await contract.evaluateTransaction(func, otherContract, key, theChannel);
    console.log(`Transaction has been submitted:\n ${JSON.stringify(result)}`);
    const obj = JSON.stringify(result);
    const o = JSON.parse(obj);
    // console.log(o);
    
    // console.log(`\nTHis is the array\n ${o.data}`);
    

    o.data.toString().split(',').forEach((s) => (sb.append(String.fromCharCode(parseInt(s, 10)))));
    const myJson = JSON.parse(sb.toString());
    console.log(myJson.payload.offset);
    console.log(myJson.payload.limit);
    // console.log(myJson.payload.buffer.data);
    sb.clear();
    /**
     * The data array contains the JSON object, but the definition does not start at the begining of the array.
     * Use the 'offset' and 'limit' values in the payload section to identify the start and end of the JSON object.
     * Use the same principle as above where the stringbuilder collects the converted ascii characters from the
     * payload.buffer.data array, then use the offest and limit values to find the start and end of the JSON definition.
     * After that, it's easy to convert it to a proper JSON object.
     */
    myJson.payload.buffer.data.toString().split(',').forEach((s) => (sb.append(String.fromCharCode(parseInt(s, 10)))));
    const json = JSON.parse(sb.substring(myJson.payload.offset, myJson.payload.limit));
    // console.log(sb.substring(myJson.payload.offset, myJson.payload.limit));
    console.log(json.ClientName);

    // Disconnect from the gateway.
    gateway.disconnect();

    return result;

  } catch (error) {
    console.error(`Failed to submit createKeyValue transaction: ${error}`);
  }    
}