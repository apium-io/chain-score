import { useState, useEffect } from "react";
import { fetchWalletContracts, fetchTrustScore } from "./api/api";
import { ethers } from "ethers";
import { useWallet } from "../components/WalletContext";
import router from "next/router";

const formatDate = (timestamp: bigint | number) => {
  const timestampInSeconds =
    typeof timestamp === "bigint" ? Number(timestamp) : timestamp;

  const date = new Date(Number(timestampInSeconds) * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatAmount = (amountInWei: string) => ethers.formatEther(amountInWei);

export default function IndexPage() {
  const { walletAddress } = useWallet();
  const [contracts, setContracts] = useState<any[] | null>(null);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) {
      setContracts(null);
      setTrustScore(null);
      setError(null);
      return;
    }

    const fetchData = async () => {
      try {
        console.log({ walletAddress });

        const contracts = await fetchWalletContracts(walletAddress);
        console.log({ contracts });

        setContracts(contracts);

        const score = await fetchTrustScore(walletAddress);
        setTrustScore(score / 10);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      }
    };

    fetchData();
  }, [walletAddress]);

  const handleContractClick = (contractData: string) => {
    router.push(
      `/payment-history?contractId=${contractData[0]}&amount=${formatAmount(
        contractData[3]
      )}`
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      {!walletAddress ? (
        <div className="flex items-center justify-center font-medium w-full h-full">
          <p className="text-gray-700">Please connect your wallet...</p>
        </div>
      ) : (
        <>
          {error && <p className="text-red-500">{error}</p>}

          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center justify-between">
            Your Contracts
            {trustScore !== null && (
              <div
                className={`w-14 h-14 flex items-center justify-center text-white rounded-full text-sm font-semibold ml-4 shadow-lg ${
                  trustScore === 0
                    ? "bg-gray-400 bg-opacity-70"
                    : trustScore < 5
                    ? "bg-red-500 bg-opacity-70"
                    : "bg-green-500 bg-opacity-70"
                }`}
              >
                {trustScore}
              </div>
            )}
          </h2>

          {contracts ? (
            <table className="w-full border-collapse mt-5">
              <thead>
                <tr className="text-left">
                  <th className="border-b border-gray-200 p-2 text-gray-700">
                    Contract ID
                  </th>
                  <th className="border-b border-gray-200 p-2 text-gray-700 ">
                    Payer
                  </th>
                  <th className="border-b border-gray-200 p-2 text-gray-700 ">
                    Receiver
                  </th>
                  <th className="border-b border-gray-200 p-2 text-gray-700 ">
                    Amount (ETH)
                  </th>
                  {/* <th className="border-b border-gray-200 p-2 text-gray-700 text-center">
                    Payment Date
                  </th> */}
                  <th className="border-b border-gray-200 p-2 text-gray-700 ">
                    Start Date
                  </th>
                  <th className="border-b border-gray-200 p-2 text-gray-700 ">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td
                      className="border-b border-gray-200 p-2 text-indigo-600 hover:text-red-600 cursor-pointer"
                      onClick={() => handleContractClick(contract)}
                    >
                      {contract[0]}
                    </td>
                    <td
                      className="border-b border-gray-200 p-2 text-gray-700 hover:text-indigo-600 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/wallet-contracts?walletAddress=${contract[1]}`
                        )
                      }
                    >
                      {contract[1].slice(0, 6)}....{contract[1].slice(-4)}
                    </td>
                    <td
                      className="border-b border-gray-200 p-2 text-gray-700 hover:text-indigo-600 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/wallet-contracts?walletAddress=${contract[2]}`
                        )
                      }
                    >
                      {contract[2].slice(0, 6)}....{contract[2].slice(-4)}
                    </td>
                    <td className="border-b border-gray-200 p-2 text-gray-700">
                      {formatAmount(contract[3].toString())}
                    </td>
                    {/* <td className="border-b border-gray-200 p-2 text-gray-700 text-center">
                      {formatDate(contract[4])}
                    </td> */}
                    <td className="border-b border-gray-200 p-2 text-gray-700">
                      {formatDate(contract[5])}
                    </td>
                    <td className="border-b border-gray-200 p-2 text-gray-700">
                      {formatDate(contract[6])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-gray-700">Loading contracts...</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
