import { parseEther } from "ethers";
import React, { useState } from "react";

function Index() {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convert amount from ETH to wei
    const amountInWei = parseEther(formData.amount || "0");

    const submittedData = {
      ...formData,
      amount: amountInWei.toString(),
    };
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Contract Submission
      </h1>
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
                  ? "From Wallet Address"
                  : "To Wallet Address"}
              </label>
              <input
                type="text"
                id="walletAddress"
                name={formData.role === "Payer" ? "fromWallet" : "toWallet"}
                className="mt-2 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                value={
                  formData.role === "Payer"
                    ? formData.fromWallet
                    : formData.toWallet
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
