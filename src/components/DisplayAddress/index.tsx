"use client";

import { useEffect, useState } from "react";
import { Address } from "viem";
import { useEnsName } from "wagmi";

const shortenAddress = (addr: Address | undefined): string => {
  if (addr == undefined) return "(no connected account)";
  if (addr.length > 11) {
    return addr
      .slice(0, 4)
      .concat("...")
      .concat(addr.slice(addr.length - 4));
  }
  return addr;
};

export default function DisplayAddress({
  address,
  className,
}: {
  address: Address | undefined;
  className?: string | undefined;
}) {
  const [shortAddress, setShortAddress] = useState(shortenAddress(address));
  const { data: ensName } = useEnsName({
    address,
  });

  useEffect(() => {
    setShortAddress(shortenAddress(address));
  }, [address]);

  return <span className={className}>{ensName || shortAddress}</span>;
}
