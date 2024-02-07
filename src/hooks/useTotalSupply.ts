import { erc20Abi } from "viem";
import { useReadContract } from "wagmi";
import { Address } from "viem";

/**
 * Reads the total supply of the provided ERC20 token (uses MUSHI token address by default)
 */
export default function useTotalSupply(
  token: Address
) {
  const result = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "totalSupply",
  });

  return { totalSupply: result.data, ...result };
}
