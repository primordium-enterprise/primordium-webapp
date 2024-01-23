import primordiumContracts from "@/config/primordiumContracts";
import { erc20Abi } from "viem";
import { useReadContract } from "wagmi";
import { Address } from "viem";

export default function useTotalSupply(
  { token }: { token?: Address } = { token: primordiumContracts.token.address },
) {
  const result = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "totalSupply",
  });

  return { totalSupply: result.data, ...result };
}
