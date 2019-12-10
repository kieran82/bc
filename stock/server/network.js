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
const theWallet = config.wallet;
const theChannel = config.channel;
const theClientPath = config.client;
const batchSize = Number(config.batchSize);

// connect to the connection file
const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

console.log(`Connection file is ${connection_file} `);

/* ===============================  Test Methods ====================================== */
// Common method to get a Wallet
const getWallet = () => {
  const walletPath = path.join(process.cwd(), theWallet, theClientPath);
  const wallet = new FileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);
  return wallet;

}

exports.keyExists = async (contractName, func, keyID) => {

  try {
    const wallet = getWallet();
    const exists = await wallet.exists(userName);

    console.log(`This is the stock ID ${keyID}`);

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
    console.error(`Failed to submit Stock transaction: ${error}`);
  }

}

exports.createKeyValue = async (contractName, func, keyID, value) => {
  try {
    const wallet = getWallet();
    const exists = await wallet.exists(userName);

    console.log(`This is the stock ID ${keyID}`);
    
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
    console.log(`Stock transaction has been submitted`);

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit Stock transaction: ${error}`);
  }
}

exports.updateKeyValue = async (contractName, func, testResultId, value) => {
  try {

    const wallet = getWallet();
    const exists = await wallet.exists(userName);

    console.log(`This is the stock ID ${testResultId}`);

    if (!exists) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);
      return;
    }

    // Get the contract from the network.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
    const network = await gateway.getNetwork(theChannel);
    const contract = network.getContract(contractName);

    await contract.submitTransaction(func, testResultId, value);
    console.log('Transaction has been submitted');

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
  }
}



exports.readKeyValue = async (contractName, func, keyID) => {

  try {

    const wallet = getWallet();
    const exists = await wallet.exists(userName);

    console.log(`This is the stock ID ${keyID}`);

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
    console.log(`Stock item ${keyID} has been deleted`);

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
  }
}

exports.getHistoryForKey = async (contractName, func, testResultId) => {
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
    const result = await contract.submitTransaction(func, testResultId);

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

    return result;

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
  }
}

exports.getQueryResult = async (contractName, func,  query) => {
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
    const result = await contract.submitTransaction(func, query);

    // Disconnect from the gateway.
    await gateway.disconnect();

    return result;

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
  }
}

exports.saveArray = async (contractName, func, newStockFeed) => {
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
    await contract.submitTransaction(func, newStockFeed);

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
  }

}

exports.saveArrayOneAtATime = async (contractName, func, newStockFeed) => {

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

    console.log(newStockFeed.length);

    for (let i = 0; i < newStockFeed.length; i++) {
      console.log(`${newStockFeed[i].stockId} and ${JSON.stringify(newStockFeed[i])}`);   
      
      await contract.submitTransaction(func, newStockFeed[i].stockId, JSON.stringify(newStockFeed[i]));
    }        

    // Submit the specified transaction.
    // await contract.submitTransaction(func, strArray);

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
  }
}

exports.saveArrayInSegments = async (contractName, func, newStockFeed) => {
  const gateway = new Gateway();

  try {
    let counter = 0;
    let recordCount = 0;
    let arr = [];    

    const wallet = getWallet();
    const exists = await wallet.exists(userName);    

    if (!exists) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);
      return;
    }

    // Get the contract from the network.
    
    await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
    const network = await gateway.getNetwork(theChannel);
    const contract = network.getContract(contractName);

    console.log(`Counter = ${newStockFeed.length}`);

    for (let i = 0; i < newStockFeed.length; i++) {
      arr.push(newStockFeed[i]);

      if (counter >= batchSize) {
        let strArray = JSON.stringify(arr);
        console.log(`Counter = ${counter}`);
        
        await contract.submitTransaction(func, strArray);
        // Empty the array
        arr.length = 0;
        counter = 0;
      }

      counter++;
      recordCount++;      
      // console.log(`${newStockFeed[i].orderId} and ${JSON.stringify(newStockFeed[i])}`);   
    }    
    
    let strArray = JSON.stringify(arr);
    console.log(`Counter = ${counter}`);
        
    await contract.submitTransaction(func, strArray);    

    // Disconnect from the gateway.
    gateway.disconnect();

  } catch (error) {
    if (gateway){
      gateway.disconnect();
    
    }
    
    console.error(`Failed to submit transaction: ${error}`);
  }

}





