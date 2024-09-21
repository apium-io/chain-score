import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WalletContextType {
  walletAddress: string | undefined;
  setWalletAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | undefined>(() => {
    // Load the wallet address from localStorage (if present)
    if (typeof window !== "undefined") {
      return localStorage.getItem("walletAddress") || undefined;
    }
    return undefined;
  });

  // Effect to store the walletAddress in localStorage when it changes
  useEffect(() => {
    if (walletAddress) {
      localStorage.setItem("walletAddress", walletAddress);
    } else {
      localStorage.removeItem("walletAddress");
    }
  }, [walletAddress]);

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
