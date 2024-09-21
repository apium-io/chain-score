import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    amoy: {
      url: process.env.INFURA_URL, // Replace with the correct URL for Amoy
      accounts: [process.env.PRIVATE_KEY!], // Ensure your private key is stored in an environment variable
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // Optional: If Amoy supports contract verification similar to Etherscan
  },
};

export default config;
