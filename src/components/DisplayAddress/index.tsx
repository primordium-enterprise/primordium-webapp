"use client";

import shortenAddress from "@/utils/shortenAddress";
import { useEffect, useMemo, useState } from "react";
import { Address } from "viem";
import { useEnsName } from "wagmi";

export default function DisplayAddress({
  address,
  className,
}: {
  address: Address | undefined;
  className?: string | undefined;
}) {
  const shortAddress = useMemo(() => shortenAddress(address), [address]);
  const { data: ensName } = useEnsName({
    address,
  });

  return <span className={`${className ? className : ''} font-roboto-mono`}>{ensName || shortAddress}</span>;
}
