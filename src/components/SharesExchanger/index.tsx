"use client";

import validateStringIsNumber from "@/utils/validateStringIsNumber";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Tabs,
  Tab,
  Input,
  Spinner,
} from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import ethLogo from "public/asset-logos/eth-logo.png";
import { useAccount, useBalance } from "wagmi";
import useFormattedBalance from "@/hooks/useFormattedBalance";

const sharePrice = {
  quoteAmount: BigInt("1000"),
  mintAmount: BigInt("10"),
};

export default function SharesExchanger() {
  const {
    formatted: ethBalance,
    result: { isError: isEthBalanceError },
  } = useFormattedBalance();

  const [depositValue, setDepositValue] = useState("");
  const onDepositChange = (value: string) => {
    if (validateStringIsNumber(value)) {
      setDepositValue(value);
    }
  };
  const [mintValue, setMintValue] = useState(1);

  return (
    <Card className="my-8 mx-auto w-full max-w-[480px]">
      <CardBody className="p-2">
        <Tabs variant="underlined" size="sm" className="pb-2">
          <Tab key="deposit" title="Deposit">
            <Input
              classNames={{
                input: "text-xl font-medium grow",
                inputWrapper: "py-1 h-auto",
                innerWrapper: "items-center py-2",
                label: "relative !translate-y-0 text-sm !text-default-400",
                description: "text-end",
              }}
              placeholder="0"
              label="Deposit amount"
              labelPlacement="inside"
              description={`Balance: ${isEthBalanceError ? "(error)" : ethBalance}`}
              value={depositValue}
              onValueChange={onDepositChange}
              variant="faded"
              endContent={
                <div className="flex items-center">
                  <Image src={ethLogo} alt="ETH logo" className="size-5 mr-1" />
                  <span className="text-lg text-default-400">ETH</span>
                </div>
              }
            />
          </Tab>
          <Tab key="withdraw" title="Withdraw"></Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
