import { Address } from "viem";
import useFormattedBalance from "./useFormattedBalance";
import chainConfig from "@/config/chainConfig";

export default function useFormattedMushiBalance({ address }: { address?: Address}) {
  return useFormattedBalance({ address, token: chainConfig.addresses.token });
}