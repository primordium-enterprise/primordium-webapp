"use client";

import {
  Card,
  CardBody,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { useState } from "react";
import AssetAmountInput from "../AssetAmountInput";
import primordiumContracts from "@/config/primordiumContracts";
import * as dn from "dnum";

const sharePrice = {
  quoteAmount: BigInt(1),
  mintAmount: BigInt(200),
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
