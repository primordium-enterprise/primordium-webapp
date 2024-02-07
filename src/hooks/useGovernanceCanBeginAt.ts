import { Address } from "viem";
import { useChainId, useReadContract } from "wagmi";

export default function useGovernanceCanBeginAt(
  governor: Address
) {
  const result = useReadContract({
    address: governor,
    abi: [
      {
        type: "function",
        name: "governanceCanBeginAt",
        stateMutability: "view",
        inputs: [],
        outputs: [{ type: "uint256" }],
      },
    ],
    functionName: "governanceCanBeginAt",
  });

  return { governanceCanBeginAt: result.data, ...result };
}
