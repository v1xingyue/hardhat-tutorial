import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      // url: "https://rpc-mumbai.maticvigil.com/",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    matic: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_MATIC}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    galileo: {
      url: "https://galileo.web3q.io:8545",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};

export default config;
