const { ethers, deployments } = require("hardhat");

async function main() {
  const fundMeContract = await deployments.get("FundMe");

  const fundMe = await ethers.getContractAt("FundMe", fundMeContract.address);

  console.log("Withdrawing .....");

  const transactionResponse = await fundMe.withdraw();

  await transactionResponse.wait(1);

  console.log("Done!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
