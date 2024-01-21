"use client";

import { Card, CardBody, Tabs, Tab } from "@nextui-org/react";
import { useState } from "react";
import AssetAmountInput from "../AssetAmountInput";
import primordiumContracts from "@/config/primordiumContracts";
import * as dn from "dnum";
import { sharePrice } from "@/config/primordiumSettings";

const roundRemainderDown = (value: dn.Dnum, divisor: number | bigint): dn.Dnum => {
  divisor = BigInt(divisor);
  let remainder = value[0] % divisor;
  if (remainder !== BigInt(0)) {
    return [value[0] - remainder, value[1]];
  }
  return value;
};

const parseDnumFromValueString = (value: string): dn.Dnum => {
  let end = value.length - 1;
  if (value[end] == '.') {
    if (end === 0) {
      value = '0'
    } else {
      value = value.slice(0, end)
    }
  }
  return dn.from(value, 18);
}

export default function SharesExchanger() {
  const [depositValue, setDepositValue] = useState("");
  const onDepositChange = (value: string) => {
    if (value) {
      let v = parseDnumFromValueString(value);
      let r = roundRemainderDown(v, sharePrice.quoteAmount);
      if (v[0] !== r[0]) {
        value = dn.format(r);
      }
      setMintValue(dn.format([r[0] * sharePrice.mintAmount / sharePrice.quoteAmount, r[1]]))
    } else {
      setMintValue('');
    }
    setDepositValue(value);
  };

  const [mintValue, setMintValue] = useState("");
  const onMintChange = (value: string) => {
    if (value) {
      let v = parseDnumFromValueString(value);
      let r = roundRemainderDown(v, sharePrice.mintAmount);
      if (v[0] !== r[0]) {
        value = dn.format(r);
      }
      setDepositValue(dn.format([r[0] * sharePrice.quoteAmount / sharePrice.mintAmount, r[1]]))
    } else {
      setDepositValue('');
    }
    setMintValue(value);
  };

  return (
    <Card className="mx-auto my-8 w-full max-w-[460px]">
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
