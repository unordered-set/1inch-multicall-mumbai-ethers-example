require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks:{
    mumbai:{
      url: ["https://rpc.ankr.com/polygon_mumbai"][0],
      accounts: [`0x${process.env.MUMBAI_DEPLOYMENT_PK}`],
      saveDeployments: true,
    },
    polygon: {
      url: ["https://matic-mainnet.chainstacklabs.com",
            "https://polygonapi.terminet.io/rpc",
            "https://rpc-mainnet.matic.quiknode.pro"][0],
      accounts: [`0x${process.env.POLYGON_DEPLOYMENT_PK}`],
      saveDeployments: true,
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API,
    },
  },
};
