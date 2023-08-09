const { network } = require("hardhat");
const {
  networkConfig,
  developmentNetwork,
} = require("../helper-hardhat-config");

const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  let address;

  if (developmentNetwork.includes(network.name)) {
    const ethUsdAggregator = await get("MockV3Aggregator");
    address = ethUsdAggregator.address;
  } else address = networkConfig[network.config.chainId]["ethUsdPriceFeed"];

  const args = [address];

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentNetwork.includes(network.name) &&
    process.env.SEPOLIA_API_KEY
  ) {
    verify(fundMe.address, args);
  }

  log("------------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
