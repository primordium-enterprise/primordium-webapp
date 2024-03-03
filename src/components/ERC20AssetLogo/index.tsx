'use client'

import { Address } from "viem";
import { useEffect, useMemo, useState } from "react";
import Image, { StaticImageData } from "next/image";
import ethLogo from "public/img/asset-logos/ethLogo.png";
import mushiLogo from "public/img/asset-logos/mushiLogo.png";
import { ADDRESS_ZERO } from "@/utils/constants";
import {chainConfig} from "@/config/chainConfig";
import { useChainId } from "wagmi";

function getAssetLogoSrc(token: Address | undefined, chainId: number): StaticImageData | string {
  if (token === undefined || token === ADDRESS_ZERO) {
    return ethLogo;
  } else if (token === chainConfig[chainId]?.addresses.token) {
    return mushiLogo;
  } else {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token}/logo.png`;
  }
};

const BLANK = "BLANK";

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
  const chainId = useChainId();
  const [logoSrc, setLogoSrc] = useState<string | StaticImageData>(getAssetLogoSrc(asset, chainId));

  useEffect(() => {
    setLogoSrc(getAssetLogoSrc(asset, chainId));
  }, [asset, chainId]);

  const alt = useMemo(() => {
    return !asset || asset === ADDRESS_ZERO ? "ETH asset logo" : "ERC20 asset logo";
  }, [asset]);

  return (
    logoSrc !== BLANK ? (
      <Image
        src={logoSrc}
        unoptimized
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={() => setLogoSrc(BLANK)}
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