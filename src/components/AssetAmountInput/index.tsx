"use client";

import useFormattedBalance from "@/hooks/useFormattedBalance";
import { Input } from "@nextui-org/react";
import { Address } from "viem";
import validateStringIsNumber from "@/utils/validateStringIsNumber";
import { useAccount } from "wagmi";
import ERC20AssetLogo from "../ERC20AssetLogo";

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
        input: "text-xl font-medium grow basis-0 font-roboto-mono",
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
          <ERC20AssetLogo asset={token} className="mr-1 size-5 rounded-full" />
          <span className="text-md text-default-400">{symbol}</span>
        </div>
      }
    />
  );
}
