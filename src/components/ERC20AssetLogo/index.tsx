'use client'

import { Address } from "viem";
import { useMemo, useState } from "react";
import Image, { StaticImageData } from "next/image";
import ethLogo from "public/img/asset-logos/ethLogo.png";
import mushiLogo from "public/img/asset-logos/mushiLogo.png";
import { ADDRESS_ZERO } from "@/utils/constants";
import primordiumContracts from "@/config/primordiumContracts";

export function getAssetLogoSrc(token: Address | undefined): StaticImageData | string {
  if (token === undefined || token === ADDRESS_ZERO) {
    return ethLogo;
  } else if (token === primordiumContracts.token.address) {
    return mushiLogo;
  } else {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token}/logo.png`;
  }
};

export default function ERC20AssetLogo({
  asset,
  width = 128,
  height = 128,
  className
}: {
  asset: Address | undefined,
  width?: number,
  height?: number,
  className?: string
}) {
  const [logoSrc, setLogoSrc] = useState(getAssetLogoSrc(asset));

  const alt = useMemo(() => {
    return !asset || asset === ADDRESS_ZERO ? "ETH asset logo" : "ERC20 asset logo";
  }, [asset]);

  return (
    logoSrc ? (
      <Image
        src={logoSrc}
        unoptimized
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={() => setLogoSrc("")}
      />
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill={`#${(asset as Address).slice((asset as Address).length - 6)}`}
        className={`bi bi-circle-fill ${className || ''}`}
        viewBox="0 0 16 16"
      >
        <circle cx="8" cy="8" r="8" />
      </svg>
    )
  );
}