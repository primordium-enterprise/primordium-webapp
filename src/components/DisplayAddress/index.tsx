'use client'

import { useEffect, useState } from "react"
import { Address } from "viem"
import { useEnsName } from "wagmi";

const shortenAddress = (addr: Address | undefined): string => {
  if (addr == undefined) return '(no connected account)';
  if (addr.length > 11) {
    return addr.slice(0, 5).concat('...').concat(addr.slice(addr.length - 4));
  }
  return addr;
}

type Props = {
  address: Address | undefined,
  // useAvatar: boolean,
  // avatarWidth:
}

export default function DisplayAddress({
  address
}: Props) {
  const [shortAddress, setShortAddress] = useState(shortenAddress(address));
  const { data: ensName } = useEnsName({
    address
  });

  useEffect(() => {
    setShortAddress(shortenAddress(address))
  }, [address]);

  return (
    <span>
      {ensName || shortAddress}
    </span>
  )
}