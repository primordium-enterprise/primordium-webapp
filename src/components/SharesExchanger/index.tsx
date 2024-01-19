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
import ethLogo from "public/img/asset-logos/0x.png";
import { useAccount, useBalance } from "wagmi";
import useFormattedBalance from "@/hooks/useFormattedBalance";
import AssetAmountInput from "../AssetAmountInput";

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
    <Card className="my-8 mx-auto w-full max-w-[460px]">
      <CardBody className="p-2">
        <Tabs variant="underlined" size="sm" className="pb-2">
          <Tab key="deposit" title="Deposit">
            <AssetAmountInput
              value={depositValue}
              onValueChange={setDepositValue}
              label="Deposit amount"
            />
          </Tab>
          <Tab key="withdraw" title="Withdraw"></Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
