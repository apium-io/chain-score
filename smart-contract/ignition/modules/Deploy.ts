import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ChainScoreModule", (m) => {
  const ChainScore = m.contract("ChainScore");

  return { ChainScore };
});
