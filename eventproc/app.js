var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider("http://140.87.66.68:22000"));
web3.eth.defaultAccount = web3.eth.coinbase;

console.log(web3.eth.defaultAccount);

