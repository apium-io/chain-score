// components/Header.tsx
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import {
  IDKitWidget,
  ISuccessResult,
  IVerifyResponse,
  VerificationLevel,
} from "@worldcoin/idkit";
import { useSDK } from "@metamask/sdk-react";
import router from "next/router";
import { useWallet } from "../components/WalletContext";
import worldCoinLogo from "../assets/worldcoin-org-wld-logo.svg";
import Image from "next/image";

async function verify(
  proof: ISuccessResult,
  app_id: `app_${string}`,
  action: string,
  signal: string
) {
  const response = await fetch("/api/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      proof,
      app_id,
      action,
      signal,
    }),
  });

  const result = (await response.json()) as IVerifyResponse;
  if (response.ok) {
    console.log("handleVerify Success!", result);

    // Use next-auth signIn to store Worldcoin verification data in session
    await signIn("credentials", {
      verificationData: result, // Pass the verification result to next-auth
      redirect: false, // Avoid page redirection after sign-in
    });
  } else {
    throw new Error("handleVerify Error: " + result.detail);
  }
}

export default function Header({
  app_id,
  action,
  signal,
}: {
  app_id: any;
  action: any;
  signal: any;
}) {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const { sdk } = useSDK();
  const { walletAddress, setWalletAddress } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("Copy Address");

  const handleContractClick = () => {
    router.push("/contract");
  };

  const handleConnectWallet = async () => {
    try {
      if (!sdk) {
        console.warn("MetaMask SDK is not available");
        return;
      }

      const accounts = await sdk.connect();
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      } else {
        console.warn("No accounts returned from SDK");
      }
    } catch (err) {
      console.warn("Failed to connect..", err);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      if (!sdk) {
        console.warn("MetaMask SDK is not available");
        return;
      }

      await sdk.terminate();

      setWalletAddress(undefined);
    } catch (err) {
      console.warn("Failed to disconnect..", err);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopyStatus("Copied!");
      setTimeout(() => {
        setCopyStatus("Copy Address");
      }, 1000);
    }
  };

  return (
    <header className="bg-white shadow-md w-full">
      <div className="mx-auto py-4 flex items-center justify-between max-w-6xl px-4">
        {/* Logo */}
        <div className="flex items-center space-x-6">
          <a href="/" className="text-2xl font-bold text-gray-800">
            ChainScore
          </a>
        </div>

        {/* Navigation Links and Auth Buttons */}
        <div className="flex items-center space-x-8">
          {!session && !loading && (
            <IDKitWidget
              action={action}
              signal={signal}
              onError={(error) => console.log("onError: ", error)}
              onSuccess={(response) => console.log("onSuccess: ", response)}
              handleVerify={(proof) => verify(proof, app_id, action, signal)}
              app_id={app_id}
              verification_level={VerificationLevel.Device}
            >
              {({ open }) => (
                <button
                  onClick={open}
                  className="relative inline-flex items-center justify-center px-6 py-3 font-bold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
                >
                  <Image
                    src={worldCoinLogo}
                    width={24}
                    height={24}
                    alt="Worldcoin Logo"
                    className="mr-3"
                  />
                  Verify with Worldcoin
                </button>
              )}
            </IDKitWidget>
          )}
          {session?.user && (
            <div className="flex items-center space-x-8">
              {/* User Avatar and Name */}
              <div className="flex items-center space-x-4">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full border border-gray-200 shadow-sm"
                  />
                )}
              </div>

              {/* Navigation Links */}
              <nav className="flex items-center space-x-6">
                <a
                  href="/"
                  className="text-gray-800 font-medium hover:text-indigo-600 transition-colors"
                >
                  Home
                </a>
                <a
                  href="contract"
                  className="text-gray-800 font-medium hover:text-indigo-600 transition-colors"
                >
                  Contract
                </a>
                <a
                  href="txHistory"
                  className="text-gray-800 font-medium hover:text-indigo-600 transition-colors"
                >
                  TX History
                </a>
                {!walletAddress ? (
                  <button
                    className="rounded-full w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={handleConnectWallet}
                  >
                    <img
                      width="25"
                      height="25"
                      src="https://img.icons8.com/ios-filled/50/wallet.png"
                      alt="wallet"
                    />
                  </button>
                ) : (
                  <div className="flex items-center space-x-4 relative">
                    <button
                      className="rounded-full px-4 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                      onClick={toggleDropdown}
                    >
                      <img
                        width="25"
                        height="25"
                        src="https://img.icons8.com/color/48/metamask-logo.png"
                        alt="MetaMask"
                        className="mr-2"
                      />
                      <span className="text-gray-800 font-medium hover:text-indigo-600 transition-colors">
                        {walletAddress
                          ? `${walletAddress.slice(
                              0,
                              6
                            )}....${walletAddress.slice(-4)}`
                          : "No account"}
                      </span>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-2 w-40">
                        <button
                          className="text-gray-800 font-medium hover:text-red-600 w-full text-center mb-2"
                          onClick={handleCopyAddress}
                        >
                          {copyStatus}
                        </button>

                        <button
                          className="text-gray-800 font-medium hover:text-red-600 w-full text-center"
                          onClick={() => {
                            handleDisconnectWallet();
                            toggleDropdown();
                          }}
                        >
                          Disconnect
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <a
                  href={`/api/auth/signout`}
                  className="text-white bg-red-500 px-5 py-2 rounded-lg font-medium shadow-sm transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  Sign out
                </a>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
