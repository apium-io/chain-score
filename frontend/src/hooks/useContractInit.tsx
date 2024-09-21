import { Contract } from "ethers";
import { useMemo } from "react";
import ABI from "../pages/api/abi.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS;

const useGreetingContract = (state) => {
  //   const { state } = useWeb3Context() as IWeb3Context;

  return useMemo(
    () => state.signer && new Contract(CONTRACT_ADDRESS!, ABI, state.signer),
    [state.signer]
  );
};

export default useGreetingContract;
