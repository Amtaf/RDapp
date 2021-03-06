require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
 /* paths: {
    artifacts: './src/artifacts',
  },*/
  networks: {
   /* hardhat:{
      chainId: 1337
    },*/
   /** *ropsten:{
      url: "https://ropsten.infura.io/v3/8632e7e3169d4df48a53d83c2614b3c6",
      accounts: ['0x']
    }*/
    rinkeby:{
      url:process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  }
};
