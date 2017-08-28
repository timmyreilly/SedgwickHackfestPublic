require("dotenv").config();

const path = require("path");
const Web3 = require("web3");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const server = require("http").createServer(app);

var data = {
  totalPTD: 0.0,
  deductible: { value: 0, max: 20000 },
  balances: {
    client: 0.0,
    insurer: 0.0
  },
  lastPayment: {
    client: 0,
    insurer: 0
  }
};

var settlementContractAddress = process.env.SETTLEMENT_CONTRACT_ADDRESS;
console.log("Settlement contract address: " + settlementContractAddress);

var settlementABI = JSON.parse(
  fs.readFileSync("Settlement.quorum.abi", "utf-8")
);

var web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_URL));
var Settlements = web3.eth.contract(settlementABI);

const settlementInstance = Settlements.at(settlementContractAddress);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fetchData();
  // Todo - call transaction update history from blockchain
  res.sendFile(__dirname + "/" + "index.html");
});

function fetchData() {
  data.totalPTD = parseInt(settlementInstance.getClientPayToDate.call());
  data.deductible.max = parseInt(settlementInstance.getClientDeductible.call());
  data.balances.client = parseInt(settlementInstance.getClientBalance.call());
  data.balances.insurer = parseInt(settlementInstance.getInsurerBalance.call());
  data.deductible.value =
    data.totalPTD >= data.deductible.max ? data.deductible.max : data.totalPTD;
}

/**
 * curl http://localhost:8080/client/balance
 */
app.get("/data", (req, res) => {
  fetchData();
  res.send(data);
});

/**
 * curl -X PUT -d '{"value": "123"}' -H "Content-Type: application/json" http://localhost:8080/client/balance
 */
app.put("/client/balance", (req, res) => {
  const balanceChange = req.body;
  settlementInstance.addClientFunds(
    balanceChange.value,
    { from: web3.eth.accounts[0] },
    (error, result) => {
      if (error) {
        // TODO: Respond with an error
        res.send({ value: data.balances.client });
      } else {
        data.balances.client = parseInt(
          settlementInstance.getClientBalance.call()
        );
        res.send({ value: data.balances.client });
      }
    }
  );
});

/**
 * curl -X PUT -d '{"value": "123"}' -H "Content-Type: application/json" http://localhost:8080/insurer/balance
 */
app.put("/insurer/balance", (req, res) => {
  const balanceChange = req.body;
  settlementInstance.addInsurerFunds(
    balanceChange.value,
    { from: web3.eth.accounts[0] },
    (error, result) => {
      if (error) {
        // TODO: Respond with an error
        res.send({ value: data.balances.insurer });
      } else {
        data.balances.insurer = parseInt(
          settlementInstance.getInsurerBalance.call()
        );
        res.send({ value: data.balances.insurer });
      }
    }
  );
});

/**
 * curl -X POST -d '{"value": "123456"}' -H "Content-Type: application/json" http://localhost:8080/client/deductible
 */
app.post("/client/deductible", (req, res) => {
  const deductibleChange = req.body;
  settlementInstance.updateClientDeductible(
    deductibleChange.value,
    { from: web3.eth.accounts[0] },
    (error, result) => {
      data.deductible.max = parseInt(
        settlementInstance.getClientDeductible.call()
      );
      res.send(data.deductible.max);
    }
  );
});

var event = settlementInstance.PaymentFinished({ from: web3.eth.accounts[0] });
/**
 * curl -X PUT -d '{"value": "123"}' -H "Content-Type: application/json" http://localhost:8080/sedgwick/payment
 */
app.put("/sedgwick/payment", (req, res) => {
  const payment = req.body;
  settlementInstance.triggerPaymentEvent(
    payment.value,
    {
      from: web3.eth.accounts[0],
      gas: 2000009
    },
    function() {
      event.watch(function(error, result) {
        if (!error) {
          res.send({
            client: result.args._client,
            insurer: result.args._insurer
          });
        }
      });
    }
  );
});

console.log(`Starting server on ${process.env.PORT}`);
server.listen(process.env.PORT || 8080);
