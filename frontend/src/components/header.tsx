import React, { useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import { signIn, signOut, useSession } from "next-auth/react";
import router from "next/router";

export default function Header() {
  const { sdk, connected } = useSDK();
  const [account, setAccount] = React.useState<string | undefined>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("Copy Address");
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const handleContractClick = () => {
    router.push("/contract");
  };
  async function handleConnectWallet(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    try {
      if (!sdk) {
        console.warn("MetaMask SDK is not available");
        return;
      }

      const accounts = await sdk.connect();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        console.warn("No accounts returned from SDK");
      }
    } catch (err) {
      console.warn("Failed to connect..", err);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function toggleDropdown(event: React.MouseEvent<HTMLButtonElement>): void {
    setIsDropdownOpen((prevState) => !prevState);
  }

  function handleCopyAddress(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: React.MouseEvent<HTMLButtonElement>
  ): void {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopyStatus("Copied!");
      setTimeout(() => {
        setCopyStatus("Copy Address");
      }, 1000);
    }
  }

  function handleDisconnectWallet() {
    throw new Error("Function not implemented.");
  }

  return (
    <header className="bg-white shadow-md w-full">
      <div className="mx-auto py-4 flex items-center justify-between max-w-6xl px-4">
        {/* Logo */}
        <div className="flex items-center space-x-6">
          <a href="#" className="text-2xl font-bold text-gray-800">
            ChainScore
          </a>
        </div>

        {/* Navigation Links and Auth Buttons */}
        <div className="flex items-center space-x-8">
          {!session && !loading && (
            <a
              href={`/api/auth/signin`}
              className="text-white bg-indigo-600 px-5 py-2 rounded-lg font-medium shadow-sm transition-colors"
              onClick={(e) => {
                e.preventDefault();
                signIn("worldcoin");
              }}
            >
              Sign in
            </a>
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
                {/* Uncomment to show user email */}
                {/* <div className="text-gray-800">
                  <p className="text-sm">Signed in as</p>
                  <p className="font-semibold">
                    {session.user.email &&
                      `${session.user.email.slice(0, 6)}...${session.user.email.slice(-4)}`}
                  </p>
                </div> */}
              </div>

              {/* Navigation Links */}
              <nav className="flex items-center space-x-6">
                <a
                  href="/contract"
                  onClick={handleContractClick}
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

                {!account ? (
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
                        {account
                          ? `${account.slice(0, 6)}....${account.slice(-4)}`
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
