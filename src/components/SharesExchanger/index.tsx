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
import AssetAmountInput from "../AssetAmountInput";
import primordiumContracts from "@/config/primordiumContracts";

const sharePrice = {
  quoteAmount: BigInt("1000"),
  mintAmount: BigInt("10"),
};

export default function SharesExchanger() {

  const [depositValue, setDepositValue] = useState("");
  const onDepositChange = (value: string) => {
    setDepositValue(value);
  };

  const [mintValue, setMintValue] = useState("");
  const onMintChange = (value: string) => {
    setMintValue(value);
  }

  return (
    <Card className="my-8 mx-auto w-full max-w-[460px]">
      <CardBody className="p-2">
        <Tabs variant="underlined" size="sm" className="pb-2">
          <Tab key="deposit" title="Deposit">
            <AssetAmountInput
              value={depositValue}
              onValueChange={onDepositChange}
              label="Deposit amount"
            />
            <AssetAmountInput
              value={mintValue}
              onValueChange={onMintChange}
              label="Mint amount"
              token={primordiumContracts.token.address}
            />
          </Tab>
          <Tab key="withdraw" title="Withdraw"></Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
