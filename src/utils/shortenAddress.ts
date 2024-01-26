import { Address } from "viem";

export default function shortenAddress(addr: Address | undefined): string {
  if (addr == undefined) return "(no connected account)";
  if (addr.length > 11) {
    return [addr.slice(0, 4), addr.slice(addr.length - 4)].join("...");
  }
  return addr;
}
