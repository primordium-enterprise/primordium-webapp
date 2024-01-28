import primordiumContracts from "@/config/primordiumContracts";
import { Address } from "viem";
import { useReadContract } from "wagmi";

export default function useGovernanceCanBeginAt(governor: Address = primordiumContracts.governor.address) {
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

  return { governanceCanBeginAt: result.data, ...result }
}