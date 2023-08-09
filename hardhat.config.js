require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("dotenv").config();
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // solidity: "0.8.19",
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.7.0" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: `${process.env.RPC_URL_ETH}`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6,
    },
  },
  etherscan: {
    apiKey: process.env.SEPOLIA_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
};
