const { deployments, getNamedAccounts, ethers } = require("hardhat");
const { assert, expect } = require("chai");
describe("FundMe", async function () {
  let deployer;
  let fundMe;
  let mockV3Aggregator;

  const sendValue = ethers.parseEther("1");

  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;

    await deployments.fixture(["all"]);
    const fundMeContract = await deployments.get("FundMe");
    fundMe = await ethers.getContractAt("FundMe", fundMeContract.address);

    const mockV3AggregatorAddress = await deployments.get("MockV3Aggregator");

    mockV3Aggregator = await ethers.getContractAt(
      "MockV3Aggregator",
      mockV3AggregatorAddress.address
    );
  });

  describe("constructor", function () {
    it("Sets the aggregator  addresses  correctly", async function () {
      const response = await fundMe.priceFeed();

      assert.equal(response, await mockV3Aggregator.getAddress());
    });
  });

  describe("fund", async function () {
    it("Fails if you don't send enough ETH", async function () {
      await expect(fundMe.fund()).to.be.revertedWith("Not enough ether sent");
    });

    it("Should update the amount in mapping", async function () {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.addressToAmountFunded(deployer);

      assert.equal(response, sendValue);
    });

    it("Should update the funders array", async function () {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.funders(0);

      assert.equal(response, deployer);
    });
  });

  describe("withdraw", function () {
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue });
    });

    it("Should withdraw user amount", async () => {
      const provider = ethers.provider;
      const startingFundMeBalance = await provider.getBalance(fundMe.target);

      const startingDeployerBalance = await provider.getBalance(deployer);

      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);

      const { gasUsed, gasPrice: effectiveGasPrice } = transactionReceipt;

      const gasCost = gasUsed * effectiveGasPrice;

      const endingFundMeBalance = await provider.getBalance(fundMe.target);

      const endingDeployerBalance = await provider.getBalance(deployer);

      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        (startingFundMeBalance + startingDeployerBalance).toString(),
        (endingDeployerBalance + gasCost).toString()
      );
    });

    it("Should withdraw multiple user amounts", async () => {
      for (let i = 1; i < 6; i++) {
        const accounts = await ethers.getSigners();
        const fundMeContract = await fundMe.connect(accounts[i]);
        await fundMeContract.fund({ value: sendValue });
      }

      const provider = ethers.provider;
      const startingFundMeBalance = await provider.getBalance(fundMe.target);

      const startingDeployerBalance = await provider.getBalance(deployer);

      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);

      const { gasUsed, gasPrice: effectiveGasPrice } = transactionReceipt;

      const gasCost = gasUsed * effectiveGasPrice;

      const endingFundMeBalance = await provider.getBalance(fundMe.target);

      const endingDeployerBalance = await provider.getBalance(deployer);

      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        (startingFundMeBalance + startingDeployerBalance).toString(),
        (endingDeployerBalance + gasCost).toString()
      );

      await expect(fundMe.funders(0)).to.be.reverted;

      for (let i = 1; i < 6; i++) {
        const accounts = await ethers.getSigners();
        assert.equal(
          await fundMe.addressToAmountFunded(accounts[i].address),
          0
        );
      }
    });
  });
});
