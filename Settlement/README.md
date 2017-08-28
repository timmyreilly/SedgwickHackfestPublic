# Blockchain

This is a Truffle project that represents this hackfest's blockchain. You may
run the usual truffle commands like the following:


## Prerequisites

To get started there are few dependencies that this project will need.  First the project requires:

* [truffle](https://www.npmjs.com/package/truffle)
* [testrpc](https://www.npmjs.com/package/ethereumjs-testrpc)

 This can be run locally if you install nodejs and the prereqs or you can use:

 * [Truffle sandbox](https://portal.azure.com/#create/consensys.truffletruffle) on Microsoft Azure.

After installing fullfilling these dependencies, next start testrpc

``` 
testrpc
```
## Smart Contract Initialization

This project contains a single smart contract that can be compiled to ensure there are no errors before deploying to the actual blockchain.  This can be done by running the following command

```
truffle compile
```

## Testing
After successful compilation of the smart contract, the unit tests for the project should be run.  There should be 11 tests run and all should succeed.  These can be executed by running the following command

```
truffle test
```

## Deployment Prep
Finally, after all tests succeed, the smart contract can be deployed to the actual blockchain.  An Ethereum based blockchain can be created in a variety of ways.  One easy way to create this would be create either on Microsoft Azure
* [Ethereum](https://portal.azure.com/#create/microsoft-azure-blockchain.azure-blockchain-serviceethereum-consortium-blockchain)
* [Quorum](https://portal.azure.com/#create/enterprise-ethereum-alliance.eea-single-memberquorum-single-member-blockchain-network) 

After the blockchain is created, truffle configuration will be modified to allow deployment to this blockchain.  To do this, the truffle.js file should be modified.  The truffle.js configuration file controls, in part, the deployment target for migration of smart contracts to the blockchain.  This can be editted with any normal text editor.  If you are using the Truffle sandbox on Microsoft Azure, you can follow these steps:

1. First, open the truffle configuration file in vi editor.
```
vi truffle.js
```
2. Next, add a new section to the configuration, the completed configruation should look like the following.  NOTE: The host name for your blockchain node will vary based on your environment.  A publically accessible endpoint (ip address or dns name) will be required here.  Also the port number can vary based on the blockchain configuration.  Typically, this will be 2200x or 8545.
```
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    <friendly name>: {
      host: "<your ip address or dns name>",
      port: <your port number,
      network_id: "*" // Match any network id
    }
  }
};
```
3. Save the configuration file, by first pressing the ESC key followed by entering the following commands and then pressing the ENTER key.
```
:wq
```
4. That is all that is required for the configuration.

## Deployment
After the configuration has been updated/verified, the smart contracts can be deployed to either the testrpc instance or the blockchain network.  These are detailed below.

### TestRPC
For the testrpc deployment, the following command will deploy the smart contract to the test network. (by default truffle will use the first entry in the configuration, which will be localhost port 8545)
```
truffle migrate 
```

### Blockchain (Quorum or Ethereum)
For the actual blockchaind deployments, the following command can be used to do the same operation to the RPC endpoint of the node on the blockchain network.
```
truffle migrate --network <friendly name from the configuration>
``` 

## Other Items

### FAQ

* When interacting with the smart contract from a client sdk/library (such as web3js), if a transaction will be created (e.g. calling a method in the smart contract), 3 items will be needed.

  * The IP address or DNS name of the RPC endpoint of a node on the blockchain network.
  * The ABI file from the compilation of the smart contract
  * The address of the instance of smart contract that has been deployed to the blockchain.

* How can the ABI file for client libraries be created/recreated?
  * An easy way to do this is to use [solc](https://www.npmjs.com/package/solc). If this nodejs package is install globally, a command line solcjs we be avaialble to compile solidity smart contracts.
* How can I force a new version of a smart contract that was created in truffle to deploy
  * This can be done by typing `truffle migrate --network <network name> --reset`