import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ABI from "../../abi.json";

function Index() {
  const [trustScores, setTrustScores] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const CHAIN_ID = "0x13882" as const;
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS;

  const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_INFURA_API_KEY
  );
  const contract = new ethers.Contract(CONTRACT_ADDRESS!, ABI, provider);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      setTrustScores(null);
      setError(null);
      return;
    }

    const fetchData = async () => {
      try {
        const [wallets, scores] = await contract.getAllTrustScores();

        // Create an array of objects with wallet addresses and scores
        const formattedScores = wallets.map(
          (wallet: string, index: number) => ({
            walletAddress: wallet,
            score: scores[index].toString(),
          })
        );

        console.log(formattedScores);
        setTrustScores(formattedScores);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          console.error(err);
        } else {
          setError("An unknown error occurred");
          console.error("An unknown error occurred", err);
        }
      }
    };

    fetchData();
  }, [isMounted]);

  return (
    <div>
      <table className="w-full border-collapse mt-5">
        <thead>
          <tr className="text-left">
            <th className="border-b border-gray-200 p-2 text-gray-700">
              Wallet Address
            </th>
            <th className="border-b border-gray-200 p-2 text-gray-700">
              Trust Score
            </th>
          </tr>
        </thead>
        <tbody>
          {trustScores ? (
            trustScores.map(
              (
                scoreData: { walletAddress: string; score: any },
                index: number
              ) => (
                <tr key={index}>
                  <td className="border-b border-gray-200 text-gray-700 p-2">
                    {scoreData.walletAddress}
                  </td>
                  <td className="border-b border-gray-200 text-gray-700 p-2">
                    {Number(scoreData.score) / 10}
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={2} className="text-center p-4">
                {error ? error : "Loading..."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Index;
