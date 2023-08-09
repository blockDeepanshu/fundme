const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error) {
    if (error.message.includes("already veriifed")) {
      console.log(" already verified");
    } else {
      console.log(e);
    }
  }
};

module.exports = { verify };
