"use client";

import { Card, CardBody, Tabs, Tab } from "@nextui-org/react";
import DepositTabContent from "./components/DepositTabContent";
import WithdrawTabContent from "./components/WithdrawTabContent";

export default function SharesExchanger() {

  return (
    <Card className="mx-auto my-8 w-full max-w-[380px]">
      <CardBody className="p-2">
        <Tabs variant="underlined" size="sm" className="pb-2" defaultSelectedKey="withdraw">
          <Tab key="deposit" title="Deposit">
            <DepositTabContent />
          </Tab>
          <Tab key="withdraw" title="Withdraw">
            <WithdrawTabContent />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
