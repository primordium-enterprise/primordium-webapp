import primordiumContracts from "@/config/primordiumContracts";
import { useReadContract } from "wagmi";
import { Address } from "viem";

/**
 * Reads the max supply of the provided ERC20 token (uses MUSHI token address by default)
 */
export default function useMaxSupply(token: Address = primordiumContracts.token.address) {
  const result = useReadContract({
    address: token,
    abi: [
      {
        type: "function",
        name: "maxSupply",
        stateMutability: "view",
        inputs: [],
        outputs: [{ type: "uint256" }],
      },
    ],
    functionName: "maxSupply",
  });

  return { maxSupply: result.data, ...result };
}
