import { ethers } from "ethers";
import ABI from "./abi.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS;
console.log(CONTRACT_ADDRESS);

const provider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_INFURA_API_KEY
);
const contract = new ethers.Contract(CONTRACT_ADDRESS!, ABI, provider);

export const fetchWalletContracts = async (walletAddress: string) => {
  try {
    const contracts = await contract.getWalletContracts(walletAddress);
    console.log("Contracts:", contracts);

    console.log({ contracts });

    return contracts;
  } catch (err) {
    throw new Error("Error fetching contracts");
  }
};

export const fetchTrustScore = async (walletAddress: string) => {
  try {
    const score = await contract.getTrustScore(walletAddress);
    return score.toString();
  } catch (err: any) {
    if (err.message.includes("No trust scores found for this wallet")) {
      return 0;
    } else {
      throw new Error("Error fetching trust score");
    }
  }
};

export const fetchPaymentHistory = async (contractId: string) => {
  try {
    const history = await contract.getPaymentHistory(contractId);
    return history;
  } catch (err) {
    throw new Error("Error fetching payment history");
  }
};
