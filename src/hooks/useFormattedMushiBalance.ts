import { Address } from "viem";
import useFormattedBalance from "./useFormattedBalance";
import { chainConfig } from "@/config/chainConfig";
import { defaultChain } from "@/config/wagmi-config";

export default function useFormattedMushiBalance({ address }: { address?: Address}) {
  return useFormattedBalance({ address, token: chainConfig[defaultChain.id]?.addresses.token });
}