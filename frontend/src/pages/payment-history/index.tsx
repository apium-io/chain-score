import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchPaymentHistory } from "../api/api";
import { ethers } from "ethers";

const formatDate = (timestamp: BigInt | number) => {
  const timestampInSeconds =
    typeof timestamp === "bigint" ? Number(timestamp) : timestamp;

  const date = new Date(Number(timestampInSeconds) * 1000);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${formattedDate} at ${formattedTime}`;
};

const formatAmount = (amountInWei: string) => ethers.formatEther(amountInWei);

const PaymentHistoryPage = () => {
  const router = useRouter();
  const { contractId } = router.query;
  const [paymentHistory, setPaymentHistory] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof contractId === "string") {
      const fetchData = async () => {
        try {
          const history = await fetchPaymentHistory(contractId);
          setPaymentHistory(history);
        } catch (err: any) {
          setError(err.message);
          console.error(err);
        }
      };

      fetchData();
    }
  }, [contractId]);
  const handleMakePaymentClick = () => {
    router.push("/payment? ");
  };
  return (
    <div style={{ padding: "20px" }}>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Payment History for Contract ID: {contractId}
        </h2>
        <button
          type="submit"
          className=" justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleMakePaymentClick}
        >
          Make a Payment
        </button>
      </div>

      {paymentHistory === null ? (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-gray-700">Loading payment history...</p>
        </div>
      ) : paymentHistory.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-gray-700">No transactions found.</p>
        </div>
      ) : (
        <table className="w-full border-collapse mt-5">
          <thead>
            <tr>
              <th className="border-b border-gray-200 p-2 text-gray-700 text-center">
                Contract ID
              </th>
              <th className="border-b border-gray-200 p-2 text-gray-700 text-center">
                Payment Date
              </th>
              <th className="border-b border-gray-200 p-2 text-gray-700 text-center">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border-b border-gray-200 p-2 text-gray-700 text-center">
                  {payment.contractId}
                </td>
                <td className="border-b border-gray-200 p-2 text-gray-700 text-center">
                  {formatDate(payment.paymentDate)}
                </td>
                <td className="border-b border-gray-200 p-2 text-gray-700 text-center">
                  {formatAmount(payment.amount.toString())} ETH
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistoryPage;
