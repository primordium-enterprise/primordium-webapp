"use client";

import { Button, Input } from "@nextui-org/react";
import { notFound } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Address, createTestClient, http, parseEther } from "viem";
import { foundry } from "viem/chains";
import styles from "./dev.module.css";

const handleTestClientError = (handler: string) => (error: any) => {
  console.log(error);
  toast.error(handler);
};

const InputGroup = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.inputGroup}>
      {children}
    </div>
  )
}

export default function DevPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const client = useMemo(
    () =>
      createTestClient({
        chain: foundry,
        mode: "anvil",
        transport: http(),
      }),
    [],
  );

  useEffect(() => {
    client.dumpState().then(console.log);
  }, [client]);

  const [setBalanceAddress, updateSetBalanceAddress] = useState("");
  const [setBalanceValue, updateSetBalanceValue] = useState("");
  const setBalance = () => {
    client
      .setBalance({ address: setBalanceAddress as Address, value: parseEther(setBalanceValue) })
      .then(() => toast.success("successfully setBalance"))
      .catch(handleTestClientError("setBalance"));
  };

  return (
    <div className="container mx-auto max-w-[500px]">
      <h1 className="my-4 text-center text-2xl">Local Dev Page</h1>
      <InputGroup>
        <h3>Set Balance:</h3>
        <Input label="Address:" value={setBalanceAddress} onValueChange={updateSetBalanceAddress} />
        <Input
          label="Balance (ETH):"
          value={setBalanceValue}
          onValueChange={updateSetBalanceValue}
        />
        <Button onPress={setBalance}>Set Balance</Button>
      </InputGroup>
    </div>
  );
}
