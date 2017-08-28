pragma solidity ^0.4.10;

contract Settlement {

    address client;
    address administrator;
    address insurer;

    uint clientDeductible;
    uint clientBalance;
    uint clientPayToDate;

    uint clientData;
    uint insurerData;

    uint insurerBalance;

    event PaymentStarted(address _id);
    event PaymentFinished(address _from, uint _client, uint _insurer);
    event PaymentFailed(address _id);
    event ClientBalanceInsufficient(address _id);
    event InsurerBalanceInsufficient(address _id);

    event ClientBalanceDeposit(address _id);
    event ClientDeductibleUpdated(address _id);
    event ClientPaymentTriggered(address _id);
    event ClientDeductibleMet(address _id);

    event InsurerBalanceDeposit(address _id);
    event InsurerPaymentTriggered(address _id);

    function Settlement() public {
        clientBalance = 0;
        insurerBalance = 0;
        clientDeductible = 500;
        clientPayToDate = 0;
    }

    function getClientData() public constant returns (uint balance) {
        return clientData;
    }

    function getInsurerData() public constant returns (uint balance) {
        return insurerData;
    }

    function getClientBalance() public constant returns (uint balance) {
        return clientBalance;
    }

    function getInsurerBalance() public constant returns (uint balance) {
        return insurerBalance;
    }

    function getClientDeductible() public constant returns (uint balance) {
        return clientDeductible;
    }

    function getClientPayToDate() public constant returns (uint balance) {
        return clientPayToDate;
    }

    function addClientFunds(uint amount) public returns (uint balance) {
        clientBalance += amount;

        // check to see if deductible has been met
        if (clientPayToDate >= clientDeductible) {
            ClientDeductibleMet(msg.sender);
        }

        ClientBalanceDeposit(msg.sender);
        return clientBalance;
    }

    function addInsurerFunds(uint amount) public returns (uint balance) {
        insurerBalance += amount;

        InsurerBalanceDeposit(msg.sender);
        return amount;
    }

    function updateClientDeductible(uint amount) public returns (uint newDeductible) {
        ClientDeductibleUpdated(msg.sender);
        clientDeductible = amount;
        return amount;
    }

    function triggerPaymentEvent(uint amount) public returns (bool success) {
        PaymentStarted(msg.sender);

        // handle the case where the client deductible has been met
        if (clientPayToDate >= clientDeductible) {
            clientData = 0;
            insurerData = amount;
            PaymentFinished(msg.sender, 0, amount);
            return issuePaymentFromInsurer(amount);
        }

        // handle the case where the client hasn't met deductible and has insufficient balance
        if (amount > clientBalance && clientBalance < clientDeductible) {
            ClientBalanceInsufficient(msg.sender);
            clientData = 0;
            insurerData = 0;
            PaymentFinished(msg.sender,0, 0);
            return false;
        }

        // handle the case for split payment
        if (amount > (clientDeductible - clientPayToDate)) {
            var clientAmountToPay = clientDeductible - clientPayToDate;
            clientBalance = clientBalance - clientAmountToPay;
            clientPayToDate += clientAmountToPay;
            var insurerAmountToPay = amount - clientAmountToPay;
            clientData = clientAmountToPay;
            insurerData = insurerAmountToPay;
            PaymentFinished(msg.sender,clientAmountToPay, insurerAmountToPay);
            return issuePaymentFromInsurer(insurerAmountToPay);
        }

        // handle the case where the client has enough balance and hasn't met deductible
        if (amount <= clientBalance && clientBalance < clientDeductible) {
            ClientPaymentTriggered(msg.sender);
            clientBalance = clientBalance - amount;
            clientPayToDate += amount;
            clientData = amount;
            insurerData = 0;
            PaymentFinished(msg.sender,amount, 0);
            return true;
        }
    }

    function issuePaymentFromInsurer(uint amount) public returns (bool success) {
        // check if insurer balance is sufficient
        if (amount>insurerBalance) {
            InsurerBalanceInsufficient(msg.sender);
            PaymentFailed(msg.sender);
            return false;
        }

        insurerBalance -= amount;
        return true;
    }
}