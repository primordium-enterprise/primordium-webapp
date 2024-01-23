import { Address } from "viem";
import { StaticImageData } from "next/image";
import ethLogo from "public/img/asset-logos/ethLogo.png";
import mushiLogo from "public/img/asset-logos/mushiLogo.png";
import { ADDRESS_ZERO } from "./constants";
import primordiumContracts from "@/config/primordiumContracts";

export default function getAssetLogoSrc(token: Address | undefined): StaticImageData | string {
  if (token === undefined || token === ADDRESS_ZERO) {
    return ethLogo;
  } else if (token === primordiumContracts.token.address) {
    return mushiLogo;
  } else {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token}/logo.png`;
  }
};