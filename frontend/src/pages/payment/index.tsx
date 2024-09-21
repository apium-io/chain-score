import { ethers } from "ethers";
import React, { useState } from "react";
import { useWallet } from "../../components/WalletContext";
import ABI from "../api/abi.json";

const CONTRACT_ADDRESS = "0x450Ce3AB4E268064391139bc914e4491FFe25818";

function MakePayment() {
  const { walletAddress } = useWallet();
  const [formData, setFormData] = useState({
    contractID: "",
    amount: "",
  });

  const getContractWithSigner = async () => {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    } else {
      throw new Error("MetaMask is not installed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const payContract = async (contractID: string, amountInWei: bigint) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const amountInWei = BigInt(
        Math.floor(parseFloat(formData.amount) * 1e18)
      );
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Make a Payment</h1>
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Payment Information */}
        <div className="border border-gray-200 rounded-lg p-6 shadow-sm bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Payment Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="contractID"
                className="block text-sm font-medium text-gray-700"
              >
                Contract ID
              </label>
              <input
                type="text"
                id="contractID"
                name="contractID"
                className="mt-2 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                value={formData.contractID}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount (ETH)
              </label>
              <input
                type="number"
                step="any"
                id="amount"
                name="amount"
                className="mt-2 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Payment
          </button>
        </div>
      </form>
    </div>
  );
}

export default MakePayment;
