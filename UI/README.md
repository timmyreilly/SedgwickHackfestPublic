# UI Work 
This subproject contains the node.js web UI for interacting with the
blockchain.

## Setup
You'll need to make sure you have nodejs, npm, and Truffle installed.

First, make sure you have the contract ABI files available:
```                                                                             
cd Settlement                                                                   
truffle compile                                                                 
```                                                                             


You will also need to create a `.env` file to set the port and other
environment variables (please note that you may need to change your `WEB3_URL`
to point to Azure as well as use real values for `CLIENT_ADDRESS`,
`INSURER_ADDRESS`, and `SEDGWICK_ADDRESS`). It should look something like this:

```
PORT=8080                                                                       
WEB3_URL=http://140.87.66.68:22000
SETTLEMENT_CONTRACT_ADDRESS=0x1234d38b335049ddad7b8d83efff35e16e7496d2
```

Once you've set that up, you can run:

```
npm install
node app.js
```

## Test Requests
You may run the following requests to test that the server is behaving as
expected:

### Get the current state of the client deductible
```
curl -v 'http://localhost:8080/client/deductible'
```

### Deposit into the client deductible
```
curl -v  -d '{"amount":123.00}' -H "Content-Type: application/json" 'http://localhost:8080/client/deductible'
```

##Looking Forward
Instead of implimenting the Web3 calls in the backend (node side), it would be better to impliment these on the front end. This way we can hook into the events that solidity emits and have our UI react to those changes. For more on events visit consensys: https://media.consensys.net/technical-introduction-to-events-and-logs-in-ethereum-a074d65dd61e 
Also, there's a relevant example in eventsExample.js 


Other options to have the UI actively respond to changes is to use sockets to push that data from the back end to the front end. And instead of fetching data on the backend, respond to the solidity events instead.

