import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import { useWallet } from "../../components/WalletContext";
import ABI from "../api/abi.json";
import { useRouter } from "next/router";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS;

function MakePayment() {
  const { walletAddress } = useWallet();
  const router = useRouter();
  const { contractId, amount } = router.query;

  const [formData, setFormData] = useState({
    contractID: "",
    amount: "",
  });

  // Set initial values when the query parameters are available
  useEffect(() => {
    if (contractId && amount) {
      setFormData({
        contractID: Array.isArray(contractId) ? contractId[0] : contractId,
        amount: Array.isArray(amount) ? amount[0] : amount,
      });
    }
  }, [contractId, amount]);

  const getContractWithSigner = async () => {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      return new ethers.Contract(CONTRACT_ADDRESS!, ABI, signer);
    } else {
      throw new Error("MetaMask is not installed");
    }
  };

  const payContract = async (contractID, amountInWei) => {
    try {
      const contractWithSigner = await getContractWithSigner();
      const tx = await contractWithSigner.payContract(contractID, {
        value: amountInWei,
      });

      await tx.wait();
      return tx;
    } catch (err) {
      console.error("Payment failed", err);
      throw new Error("Failed to process payment");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const parsedAmount = parseFloat(formData.amount);

      // Validate amount before converting to Wei
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Invalid amount provided");
      }

      const amountInWei = ethers.parseUnits(formData.amount, "ether");
      if (!walletAddress) {
        throw new Error("Wallet is not connected");
      }

      await payContract(formData.contractID, amountInWei);
      alert("Payment successful");
    } catch (error) {
      console.error("Error making payment:", error);
      alert("Failed to make payment");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-lg bg-opacity-10 backdrop-filter backdrop-blur-lg border border-indigo-700 bg-gradient-to-br from-indigo-900 to-purple-900 ">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-300 tracking-wider">
          Make a Payment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative">
              <label
                htmlFor="contractID"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Contract ID
              </label>
              <input
                type="text"
                id="contractID"
                name="contractID"
                className="w-full p-4 bg-indigo-100 bg-opacity-20 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-600"
                value={formData.contractID}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Amount (ETH)
              </label>
              <input
                type="number"
                step="any"
                id="amount"
                name="amount"
                className="w-full p-4 bg-indigo-100 bg-opacity-20 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-600"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              Submit Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MakePayment;
