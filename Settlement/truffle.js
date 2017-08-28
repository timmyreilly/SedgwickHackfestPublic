module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    quorum: {
      host: "140.87.66.68",
      port: 22000,
      network_id: "*" // Match any network id
    }
  }
};
