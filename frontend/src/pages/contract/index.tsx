import { ethers } from "ethers";
import React, { useState } from "react";
import { useWallet } from "../../components/WalletContext";
import { v7 as uuidv7 } from "uuid";
// import { initializeBusinessContract } from "../api/api";
import ABI from "../api/abi.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS;

function Index() {
  const { walletAddress } = useWallet();
  const [formData, setFormData] = useState({
    contractID: "",
    role: "Payer",
    fromWallet: "",
    toWallet: "",
    amount: "",
    paymentDate: "",
    contractStartDate: "",
    contractEndDate: "",
    cycle: "monthly",
  });

  const getContractWithSigner = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      console.log({ signer });
      return new ethers.Contract(CONTRACT_ADDRESS!, ABI, signer);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (name === "role") {
        updatedData.fromWallet = "";
        updatedData.toWallet = "";
      }

      return updatedData;
    });
  };

  const initializeBusinessContract = async (
    walletAddress: string,
    data: {
      contractID: string;
      fromWallet?: string;
      toWallet: string;
      amount: string;
      paymentDate: number;
      contractStartDate: number;
    }
  ) => {
    console.log({ data });
    const contractWithSigner = await getContractWithSigner();
    console.log({ contractWithSigner });

    try {
      if (!walletAddress) {
        throw new Error("Wallet is not connected");
      }

      const amountInWei = BigInt(Math.floor(parseFloat(data.amount) * 1e18));
      const paymentDateTimestamp = 172942403500;
      const startDateTimestamp = 172942403500;

      console.log({ amountInWei, paymentDateTimestamp, startDateTimestamp });

      const tx = await contractWithSigner?.initializeBusinessContract(
        data.contractID,
        walletAddress,
        data.toWallet,
        amountInWei,
        data.paymentDate,
        data.contractStartDate
      );

      await tx.wait();
      console.log({ tx });
      return tx;
    } catch (err) {
      console.error("Contract initialization failed", err);
      throw new Error("Failed to initialize business contract");
    }
  };

  const init = async () => {};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const contractData = {
        contractID: `${uuidv7()}`,
        // fromWallet: "0x1f7D7c734fe1142545a9B6d98328c65430b7Bff9",
        toWallet: formData.toWallet,
        amount: formData.amount,
        paymentDate: +formData.paymentDate, //TODO: Change This
        contractStartDate: +new Date(formData.contractStartDate),
      };

      if (walletAddress) {
        await initializeBusinessContract(walletAddress, contractData);
      } else {
        alert("Please connect your wallet");
      }
      alert("Contract initialized successfully");
    } catch (error) {
      console.error("Error initializing contract:", error);
      alert("Failed to initialize contract");
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Contract Submission
      </h1>
      <button onClick={init}>CLICK ME</button>
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Contract Information */}
        <div className="border border-gray-200 rounded-lg p-6 shadow-sm bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Contract Information
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
                htmlFor="cycle"
                className="block text-sm font-medium text-gray-700"
              >
                Cycle
              </label>
              <select
                id="cycle"
                name="cycle"
                className="mt-2 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                value={formData.cycle}
                onChange={handleChange}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="contractStartDate"
                className="block text-sm font-medium text-gray-700"
              >
                Contract Start Date
              </label>
              <input
                type="date"
                id="contractStartDate"
                name="contractStartDate"
                className="mt-2 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                value={formData.contractStartDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="contractEndDate"
                className="block text-sm font-medium text-gray-700"
              >
                Contract End Date
              </label>
              <input
                type="date"
                id="contractEndDate"
                name="contractEndDate"
                className="mt-2 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                value={formData.contractEndDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                You are the
              </label>
              <select
                id="role"
                name="role"
                className="mt-2 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Payer">Payer</option>
                <option value="Receiver">Receiver</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="walletAddress"
                className="block text-sm font-medium text-gray-700"
              >
                {formData.role === "Payer"
                  ? "To Wallet Address"
                  : "From Wallet Address"}
              </label>
              <input
                type="text"
                id="walletAddress"
                name={formData.role === "Payer" ? "toWallet" : "fromWallet"}
                className="mt-2 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                value={
                  formData.role === "Payer"
                    ? formData.toWallet
                    : formData.fromWallet
                }
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="paymentDate"
                className="block text-sm font-medium text-gray-700"
              >
                Payment Date (1-30)
              </label>
              <input
                type="number"
                id="paymentDate"
                name="paymentDate"
                className="mt-2 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                value={formData.paymentDate}
                onChange={handleChange}
                min="1"
                max="30"
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
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Index;
