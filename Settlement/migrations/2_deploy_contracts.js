var Settlement = artifacts.require("./Settlement.sol");

module.exports = function(deployer) {
  deployer.deploy(Settlement);
};
