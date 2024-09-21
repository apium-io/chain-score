import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    amoy: {
      url: `https://linea-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`, // Replace with the correct URL for Amoy
      accounts: [process.env.PRIVATE_KEY!], // Ensure your private key is stored in an environment variable
    },
    linea_mainnet: {
      url: `https://linea-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: "5JDTMXYS6GD4I2WXYPA5T9729Y7QQPTWS2", // Optional: If Amoy supports contract verification similar to Etherscan
    customChains: [
      {
        network: "linea_mainnet",
        chainId: 59144,
        urls: {
          apiURL: "https://api.lineascan.build/api",
          browserURL: "https://lineascan.build",
        },
      },
    ],
  },
};

export default config;
