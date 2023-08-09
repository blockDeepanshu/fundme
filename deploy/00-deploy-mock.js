const { network } = require("hardhat");
const {
  developmentNetwork,
  DECIMAL,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (developmentNetwork.includes(network.name)) {
    log("Local network detected ! Deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMAL, INITIAL_ANSWER],
    });
    log("Mock Deployed");
    log("-------------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
