'use client'

import useFormattedBalance from "@/hooks/useFormattedBalance";
import { Input } from "@nextui-org/react";
import { Dispatch, SetStateAction } from "react";
import { Address } from "viem";
import Image from "next/image";
import validateStringIsNumber from "@/utils/validateStringIsNumber";

export default function AssetAmountInput({
  value,
  onValueChange,
  label = '',
  token,
}: {
  value: string,
  onValueChange: (value: string) => void,
  label?: string,
  token?: Address,
}) {
  const { formatted: balance, symbol, result: { isError: isBalanceError } } = useFormattedBalance({ token });

  return (
    <Input
      classNames={{
        input: "text-xl font-medium grow",
        inputWrapper: "py-1 h-auto",
        innerWrapper: "items-center py-2",
        label: "relative !translate-y-0 text-sm !text-default-400",
        description: "text-end",
      }}
      value={value}
      onValueChange={(v) => { if (validateStringIsNumber(v)) { onValueChange(v) } }}
      placeholder="0"
      label={label}
      labelPlacement="inside"
      description={`Balance: ${isBalanceError ? "(error)" : balance}`}
      variant="faded"
      endContent={
        <div className="flex items-center">
          <Image src={`/img/asset-logos/${token || '0x'}.png`} alt="ETH logo" width={128} height={128} className="size-5 mr-1" />
          <span className="text-lg text-default-400">{symbol}</span>
        </div>
      }
    />
  );
}