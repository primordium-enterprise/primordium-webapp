import { defaultChain } from "@/config/chainConfig";
import { sepolia } from "viem/chains";

export default function buildEtherscanURL(path: string) {
  return `https://${defaultChain.id === sepolia.id ? "sepolia." : ""}etherscan.io/${path}`;
}
