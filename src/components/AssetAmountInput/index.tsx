"use client";

import useFormattedBalance from "@/hooks/useFormattedBalance";
import { Input } from "@nextui-org/react";
import { Address } from "viem";
import Image, { StaticImageData } from "next/image";
import validateStringIsNumber from "@/utils/validateStringIsNumber";
import { useAccount } from "wagmi";
import ethLogo from "public/img/asset-logos/ethLogo.png";
import mushiLogo from "public/img/asset-logos/mushiLogo.png";
import primordiumContracts from "@/config/primordiumContracts";

const getAssetLogoSrc = (token: Address | undefined): StaticImageData | string => {
  if (token === undefined || token == `0x0000000000000000000000000000000000000000`) {
    return ethLogo;
  } else if (token === primordiumContracts.token.address) {
    return mushiLogo;
  } else {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token}/logo.png`;
  }
};

export default function AssetAmountInput({
  value,
  onValueChange,
  label = "",
  token,
  isDisabled
}: {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  token?: Address;
  isDisabled?: boolean;
}) {
  const { address } = useAccount();
  const {
    formatted: balance,
    decimals,
    symbol,
    result: { isError: isBalanceError },
  } = useFormattedBalance({ token, address });

  return (
    <Input
      classNames={{
        input: "text-xl font-medium grow basis-0",
        inputWrapper: "py-1 h-auto",
        innerWrapper: "items-center py-2",
        label: "relative !translate-y-0 text-sm !text-default-400",
        description: "text-end",
      }}
      value={value}
      onValueChange={(v) => {
        let decimalIndex = v.indexOf('.');
        if (decimalIndex == -1 || v.length - 1 - decimalIndex <= decimals) {
          if (validateStringIsNumber(v)) {
            onValueChange(v);
          }
        }
      }}
      isDisabled={isDisabled}
      placeholder="0"
      label={label}
      labelPlacement="inside"
      description={`Balance: ${isBalanceError ? "(error)" : balance}`}
      variant="faded"
      endContent={
        <div className="flex items-center">
          <Image
            src={getAssetLogoSrc(token)}
            unoptimized
            alt="ETH logo"
            width={128}
            height={128}
            className="mr-1 size-5 rounded-full"
          />
          <span className="text-md text-default-400">{symbol}</span>
        </div>
      }
    />
  );
}
