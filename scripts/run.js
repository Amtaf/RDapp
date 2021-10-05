const { ethers } = require("hardhat");
const hre = require("hardhat");

const main = async () => {
  //const [owner, randoPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("wavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log("Contract fatmaWaves to:", waveContract.address);

  //get contract balance
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  /**let count= await waveContract.getTotalWaves()
  console.log(count.toNumber())*/

  //send wave

  /*
   * Let's try two waves now
   */
  let waveTxn = await waveContract.wave("This is wave #1");
  await waveTxn.wait();

  waveTxn = await waveContract.wave("This is wave #2");
  await waveTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
