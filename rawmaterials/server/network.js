'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const log = require("./logger");

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
const batchSize = Number(config.batchSize);
const theClientPath = config.client;

console.log(`The wallet folder is ${theWallet} and ${userName}`);


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
    const retVal = await contract.evaluateTransaction(func, keyID);
    console.log(`Return value is ${retVal}`);

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit keyExists transaction: ${error}`);
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

exports.readKeyValue = async (contractName, func, keyID, ) => {

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
    const result = await contract.evaluateTransaction(func, keyID);
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
    const result = await contract.evaluateTransaction(func, startId, endId);

    // Disconnect from the gateway.
    await gateway.disconnect();
    // Returning the raw result here and letting the client software handle the buffer.
    return result;

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
  }
}

exports.getQueryResult = async (contractName, func, query) => {
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
    const contract = network.getContract(theContract);

    // Submit the specified transaction.
    const result = await contract.evaluateTransaction(func, query);

    // Disconnect from the gateway.
    await gateway.disconnect();
    return result;

  } catch (error) {
    console.error(`Failed to evaluate the transaction: ${error}`);
  }
}


exports.saveArray = async (contractName, func, newBatchFeed) => {

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
    let strArray = JSON.stringify(newBatchFeed);   
    console.log(newBatchFeed.length);

    // for (let i = 0; i < newBatchFeed.length; i++) {
    //   console.log(`${newBatchFeed[i].orderId} and ${JSON.stringify(newBatchFeed[i])}`);   
    // }        
    

    // Submit the specified transaction.
    await contract.submitTransaction(func, strArray);

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
  }

  // try {
  //   const wallet = getWallet();
  //   const exists = await wallet.exists(userName);

  //   if (!exists) {
  //     console.log(`An identity for the user ${userName} does not exist in the wallet`);
  //     return;
  //   }

  //   // Get the contract from the network.
  //   const gateway = new Gateway();
  //   await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
  //   const network = await gateway.getNetwork(theChannel);
  //   const contract = network.getContract(contractName);

  //   // Submit the specified transaction.
  //   await contract.submitTransaction(func, keyID);
  //   console.log(`Item key ${keyID} has been deleted`);

  //   // Disconnect from the gateway.
  //   await gateway.disconnect();

  // } catch (error) {
  //   console.error(`Failed to submit transaction: ${error}`);
  // }  
}

/**
 * This function reads a JSON file and loads the contents into the blockchain
 * identified in the configuration file. 
 * 
 * @param {The full path to the JSON file to be loaded to blockchain} jsonFilePath
 */
exports.fileToBlockchain = async (jsonFilePath) => {
  const wallet = getWallet();
  const exists = await wallet.exists(userName);   

  log.logger.trace(`network.fileToBlockchain  --> ${jsonFilePath}`);

  if (!exists) {
    log.logger.error(`An identity for the user ${userName} does not exist in the wallet`);
    // console.log(`An identity for the user ${userName} does not exist in the wallet`);
    return;
  }

  // Get the contract from the network.
  const gateway = new Gateway();
  await gateway.connect(ccp, { wallet, identity: userName, discovery: gatewayDiscovery });
  const network = await gateway.getNetwork(theChannel);
  const contract = network.getContract(theContract);

  /**
   * File Start
   */

  let filePath = jsonFilePath; //path.join(process.cwd(), 'test-output.json');  // test-output.json   data.txt

  const liner = new lineByLine(filePath);
  const func = 'saveArray';
  let line;
  let counter = 0;
  let recordCount = 0;
  let arr = [];

  try {
    
    while (line = liner.next()) {
      let obj = JSON.parse(line.toString());
      /* Modify some values to be different than the ones found in the test file  */
      // let newNum = counter + 41;
      // obj.Number += newNum;
      // obj.LogSheetNumber += newNum;
      // obj.FAOArea = "Area13";
      // obj.Comment += ` - ${newNum}`;
      // obj.SupplierTraceId += newNum;
      
      arr.push(obj);

      //  Create a batch array for every 1000 objects
      if (counter === batchSize) {
        let strArray = JSON.stringify(arr);
        console.log(`Counter = ${counter}`);
        
        await contract.submitTransaction(func, strArray);
        // Empty the array
        arr.length = 0;
        counter = 0;
      }

      counter++;
      recordCount++;
    }
    
    // If the array is not at 3000 long at the end of the loop, 
    // process the remainder here.

    if (arr.length > 0) {
      let strArray = JSON.stringify(arr);
      console.log(`Counter outside of loop is ${counter}`);
      await contract.submitTransaction(func, strArray);
    }

  } catch (error) {
    console.log(error);
    await gateway.disconnect();
  }

  // Disconnect from the gateway.
  await gateway.disconnect();
}


