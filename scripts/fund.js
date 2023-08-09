const { ethers, deployments } = require("hardhat");

async function main() {
  const fundMeContract = await deployments.get("FundMe");

  const fundMe = await ethers.getContractAt("FundMe", fundMeContract.address);

  console.log("Funding .....");

  const transactionResponse = await fundMe.fund({
    value: ethers.parseEther("0.1"),
  });

  await transactionResponse.wait(1);

  console.log("funded!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
