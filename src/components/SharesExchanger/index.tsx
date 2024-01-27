"use client";

import { Card, CardBody, Tabs, Tab } from "@nextui-org/react";
import DepositTabContent from "./components/DepositTabContent";
import WithdrawTabContent from "./components/WithdrawTabContent";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const DEPOSIT_KEY = "deposit";
const WITHDRAW_KEY = "withdraw";

export default function SharesExchanger() {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();

  // Tab is synced with the "tab" URL search parameter
  const [tab, setTab] = useState(query.get("tab") || DEPOSIT_KEY);
  const changeTab = useCallback((key: string) => {
    setTab(key);
    const params = new URLSearchParams(query);
    params.set('tab', key);
    router.replace(`${pathname}?${params.toString()}`)
  }, [setTab, query, router, pathname]);

  return (
    <Card className="mx-auto my-8 w-full max-w-[380px]">
      <CardBody className="p-2">
        <Tabs
          variant="underlined"
          size="sm"
          className="pb-2"
          selectedKey={tab}
          onSelectionChange={(key) => changeTab(key as string)}
        >
          <Tab key={DEPOSIT_KEY} title="Deposit">
            <DepositTabContent />
          </Tab>
          <Tab key={WITHDRAW_KEY} title="Withdraw">
            <WithdrawTabContent />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
