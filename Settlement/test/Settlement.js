var Settlement = artifacts.require("./Settlement.sol");

contract("Settlement-General", function() {
  // validate client init
  it("should create a new instance with zero balance for client", function() {
    return Settlement.deployed()
      .then(function(instance) {
        return instance.getClientBalance.call();
      })
      .then(function(balance) {
        assert.equal(balance.valueOf(), 0, "The client balance is not zero");
      });
  });

  // validate insurer init
  it("should create a new instance with zero balance for insurer", function() {
    return Settlement.deployed()
      .then(function(instance) {
        return instance.getInsurerBalance.call();
      })
      .then(function(balance) {
        assert.equal(balance.valueOf(), 0, "The insurer balance is not zero");
      });
  });

  // validate client deductible init
  it("should create a new instance with 500 client deductible initially", function() {
    return Settlement.deployed()
      .then(function(instance) {
        return instance.getClientDeductible.call();
      })
      .then(function(deductible) {
        assert.equal(deductible.valueOf(), 500, "The deductible is not 500.");
      });
  });

  // validate client add funds
  it("should create a new instance and then add 100 to client balance", function() {
    return Settlement.deployed()
      .then(function(instance) {
        return instance.addClientFunds.call(100);
      })
      .then(function(balance) {
        assert.equal(
          balance.valueOf(),
          100,
          "The client balance after adding 100, is not 100"
        );
      });
  });

  // validate client update deductible value
  it("should create a new instance and then add 100 to the client deductible", function() {
    return Settlement.deployed()
      .then(function(instance) {
        return instance.updateClientDeductible.call(100);
      })
      .then(function(deductible) {
        assert.equal(
          deductible.valueOf(),
          100,
          "The client deductible after updating to 100, is not 100"
        );
      });
  });

  // validate client pay to date total init
  it("should create a new instance and then show that client pay to date total is zero", function() {
    return Settlement.deployed()
      .then(function(instance) {
        return instance.getClientPayToDate.call();
      })
      .then(function(payToDateTotal) {
        assert.equal(
          payToDateTotal.valueOf(),
          0,
          "The client pay to date total is not zero"
        );
      });
  });

  // validate client deductible init
  it("should create a new instance with 500 insurer balance initially", function() {
    return Settlement.deployed()
      .then(function(instance) {
        return instance.addInsurerFunds.call(500);
      })
      .then(function(balance) {
        assert.equal(balance.valueOf(), 500, "The balance is not 500.");
      });
  });
});

contract("Settlement-Payment-Split", function() {
  // validate split payment
  it("should create a new instance, add balances for both client/insurer, and trigger payment", function() {
    var _meta;
    var _clientBalancePre;
    var _insurerBalancePre;
    var _clientBalancePost;
    var _insurerBalancePost;

    return Settlement.deployed()
      .then(function(instance) {
        _meta = instance;
        return _meta.addClientFunds(400);
      })
      .then(function(result) {
        return _meta.addInsurerFunds(400);
      })
      .then(function(result) {
        return _meta.getClientBalance.call();
      })
      .then(function(balance) {
        _clientBalancePre = balance.valueOf();
        return _meta.getInsurerBalance.call();
      })
      .then(function(balance) {
        _insurerBalancePre = balance;
        return _meta.triggerPaymentEvent(500);
      })
      .then(function(result) {
        return _meta.getClientBalance.call();
      })
      .then(function(balance) {
        _clientBalancePost = balance.valueOf();
        return _meta.getInsurerBalance.call();
      })
      .then(function(balance) {
        _insurerBalancePost = balance.valueOf();
        assert.equal(
          _clientBalancePre,
          400,
          "The client balance was not 400 after initialization"
        );
        assert.equal(
          _insurerBalancePre,
          400,
          "The insurer balance was not 400 after initialization"
        );
        assert.equal(
          _clientBalancePost,
          400,
          "The client balance was not 0 after the payment"
        );
        assert.equal(
          _insurerBalancePost,
          400,
          "The insurer balance was not 300 after the payment"
        );
      });
  });
});

contract("Settlement-Payment-Trigger-Client", function() {
  // validate that the client cost is reflected after triggering a payment
  it("should create a new instance, add client data, and return", function() {
    var _meta;

    return Settlement.deployed()
      .then(function(instance) {
        _meta = instance;
        return _meta.addClientFunds(100);
      })
      .then(function(balance) {
        return _meta.getClientBalance();
      })
      .then(function(cbalance) {
        _clientBalance = cbalance.valueOf();
        return _meta.triggerPaymentEvent(100);
      })
      .then(function(data) {
        return _meta.getClientData.call();
      })
      .then(function(data) {
        console.log(data.valueOf());
        assert.equal(data.valueOf(), 100, "The getClientData was not 100");
      });
  });
});

contract("Settlement-Payment-Trigger-Insurer", function() {
  // validate that the insurer cost is reflected after triggering a payment
  it("should create a new instance, add insurer data, and return", function() {
    var _meta;

    return Settlement.deployed().then(function(instance) {
        _meta = instance;
        return _meta.addClientFunds(100);
      }).then(function(balance) {
        return _meta.getClientBalance();
      }).then(function(cbalance) {
        _clientBalance = cbalance.valueOf();
        return _meta.triggerPaymentEvent(100);
      }).then(function(data) {
        return _meta.getInsurerData.call();
      }).then(function(data) {
        assert.equal(data.valueOf(), 0, "The getClientData was not 0");
      });
  });
});

contract("Settlement-Payment-Client", function() {
  // validate client deductible not met, payment request, success
  it("should create a new instance, add client balance, request payment without deductible met", function() {
    var _meta;
    var _clientBalance;

    return Settlement.deployed()
      .then(function(instance) {
        _meta = instance;
        return _meta.addClientFunds(100);
      })
      .then(function(balance) {
        return _meta.getClientBalance();
      })
      .then(function(cbalance) {
        _clientBalance = cbalance.valueOf();
        return _meta.triggerPaymentEvent(100);
      })
      .then(function(paymentResult) {
        return _meta.getClientBalance();
      })
      .then(function(finalBalance) {
        assert.equal(
          _clientBalance,
          100,
          "The client balance was not initialized to 100"
        );
        assert.equal(
          finalBalance.valueOf(),
          0,
          "The payment was not 0 post payment"
        );
      });
  });
});
