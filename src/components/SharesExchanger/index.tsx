'use client'

import validateStringIsNumber from "@/utils/validateStringIsNumber";
import {Card, CardHeader, CardBody, CardFooter, Tabs, Tab, Input} from "@nextui-org/react";
import { useState } from "react";

const sharePrice = {
  quoteAmount: BigInt('1000'),
  mintAmount: BigInt('10')
}

export default function SharesExchanger() {

  const [depositValue, setDepositValue] = useState('0.1');
  const onDepositChange = (value: string) => {
    if (validateStringIsNumber(value)) {
      setDepositValue(value);
    }
  }
  const [mintValue, setMintValue] = useState(1);

  return (
    <Card className="my-8 mx-auto w-full max-w-[480px]">
      <CardBody className="p-2">
        <Tabs variant="underlined" size="sm">
          <Tab key="deposit" title="Deposit">
            <Input
              classNames={{
                input: "text-lg font-medium",
                inputWrapper: "h-20",
                innerWrapper: "items-center",
                label: "top-3"
              }}
              label="Deposit amount"
              value={depositValue}
              onValueChange={onDepositChange}
              variant="faded"
              endContent={<span className="text-md text-default-400">ETH</span>}
            />
          </Tab>
          <Tab key="withdraw" title="Withdraw">

          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}