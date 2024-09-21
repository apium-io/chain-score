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
    console.log(contracts);

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

export const fetchAllTrustScores = async () => {
  try {
    const score = await contract.getAllTrustScores();
    return score;
  } catch (err: any) {
    if (err.message.includes("No trust scores found for this wallet")) {
      return 0;
    } else {
      throw new Error("Error fetching trust score");
    }
  }
};

// export const initializeBusinessContract = async (data: {
//   contractID: string;
//   fromWallet: string;
//   toWallet: string;
//   amount: string;
//   paymentDate: string;
//   contractStartDate: string;
// }) => {
//   try {
//     await provider.send("eth_requestAccounts", []);
//     const amountInWei = BigInt(Math.floor(parseFloat(data.amount) * 1e18));

//     const paymentDateTimestamp = Math.floor(
//       new Date(data.paymentDate).getTime() / 1000
//     );
//     const startDateTimestamp = Math.floor(
//       new Date(data.contractStartDate).getTime() / 1000
//     );

//     console.log("Contract data being sent:", {
//       contractID: data.contractID,
//       fromWallet: data.fromWallet,
//       toWallet: data.toWallet,
//       amountInWei: amountInWei.toString(),
//       paymentDateTimestamp: paymentDateTimestamp.toString(),
//       startDateTimestamp: startDateTimestamp.toString(),
//     });

//     const tx = await contract.initializeBusinessContract(
//       data.contractID,
//       data.fromWallet,
//       data.toWallet,
//       amountInWei,
//       paymentDateTimestamp,
//       startDateTimestamp
//     );

//     await tx.wait();
//     return tx;
//   } catch (err) {
//     console.error("Contract initialization failed", err);
//     throw new Error("Failed to initialize business contract");
//   }
// };
