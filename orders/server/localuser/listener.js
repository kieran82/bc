'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const theContract = 'orders';
const lineByLine = require('n-readlines');
const log = require("./logger");

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
const contractName = 'orders';

console.log(`The wallet folder is ${theWallet} and ${userName}`);


// connect to the connection file
const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

console.log(`Connection file is ${connection_file} `);

/* ===============================  Test Methods ====================================== */
// Common method to get a Wallet
const getWallet = () => {
  const walletPath = path.join(process.cwd(), theWallet);
  const wallet = new FileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);
  return wallet;

}

const main = async () => {

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

    await contract.addContractListener('orders', 'orderEvent', (err, event, blockNumber, transactionId, status) => {
      if (err) {
        console.error(err);
        return;
      }

      //convert event to something we can parse 
      event = event.payload.toString();
      event = JSON.parse(event);

      // orderId: '1001',
      // docType: 'foodOrder',
      // despatchDate: '2019-07-20',
      // dateReceived: '2019-07-20',
      // buyerId: '0001',
      // quantity: 750,
      // qtyUnitMeasurement: 'Kg',
      // processUsed: 'Smoking',
      // orderLines: [
      //     { orderLine: 1, sourceBatchId: '101', tested: 'Yes', quantity: 500, qtyUnitMeasurement: 'Kg'},
                

      //where we output the TradeEvent
      console.log('************************ Start Order Event *******************************************************');
      console.log(`type: ${event.type}`);
      console.log(`ownerId: ${event.buyerId}`);
      console.log(`id: ${event.orderId}`);
      console.log(`description: ${event.processUsed}`);
      console.log(`status: ${event.status}`);
      console.log(`amount: ${event.quantity}`);
      console.log(`buyerId: ${event.buyerId}`);
      console.log(`Block Number: ${blockNumber} Transaction ID: ${transactionId} Status: ${status}`);
      console.log('************************ End Order Event ************************************');
    });  

  } catch (error) {
    console.error(`Failed to handle Event: ${error}`);
  }
}

main();