"use client";

import shortenAddress from "@/utils/shortenAddress";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Address } from "viem";
import { useEnsName } from "wagmi";

export default function DisplayAddress({
  address,
  knownEnsName,
  className,
  skipEns,
  enableClickToCopy
}: {
  address: Address | undefined;
  knownEnsName?: string | undefined;
  className?: string | undefined;
  skipEns?: boolean;
  enableClickToCopy?: boolean;
}) {
  const shortAddress = useMemo(() => shortenAddress(address), [address]);
  const { data: ensName } = useEnsName({
    address,
    query: {
      enabled: !knownEnsName && !skipEns
    }
  });

  return (
    <span className={`${className ? className : ""} font-roboto-mono hover:cursor-pointer`} onClick={() => {
      if (address && enableClickToCopy) {
        navigator.clipboard.writeText(address);
        toast.success("Copied address to clipboard!", { duration: 5000 });
      }
    }}>
      {skipEns ? shortAddress : knownEnsName || ensName || shortAddress}
    </span>
  );
}
