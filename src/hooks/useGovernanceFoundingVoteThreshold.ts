import primordiumContracts from "@/config/primordiumContracts";
import { Address } from "viem";
import { useReadContract } from "wagmi";

export default function useGovernanceFoundingVoteThreshold(
  governor: Address = primordiumContracts.governor.address,
) {
  const result = useReadContract({
    address: governor,
    abi: [
      {
        type: "function",
        name: "governanceFoundingVoteThreshold",
        stateMutability: "view",
        inputs: [],
        outputs: [{ type: "uint256" }],
      },
    ],
    functionName: "governanceFoundingVoteThreshold",
  });

  return { governanceFoundingVoteThreshold: result.data, ...result };
}
