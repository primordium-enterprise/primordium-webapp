import { Address } from "viem";

export default function shortenAddress(addr: Address | undefined): string {
  if (addr == undefined) return "(no connected account)";
  if (addr.length > 11) {
    return addr
      .slice(0, 4)
      .concat("...")
      .concat(addr.slice(addr.length - 4));
  }
  return addr;
};