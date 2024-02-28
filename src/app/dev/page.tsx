"use client";

import { Button, Input } from "@nextui-org/react";
import { notFound } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Address, createTestClient, http, parseEther } from "viem";
import { foundry } from "viem/chains";
import styles from "./dev.module.css";
import { useBlock, useBlockNumber } from "wagmi";

const handleTestClientError = (handler: string) => (error: any) => {
  console.log(error);
  toast.error(handler + " failed");
};

const InputGroup = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.inputGroup}>{children}</div>;
};

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

  const {
    data: block,
    isLoading: isBlockLoading,
    refetch: refetchBlock,
  } = useBlock({ watch: true });

  useEffect(() => {
    client.dumpState().then(console.log);
  }, [client]);

  const [blocksToMine, updateBlocksToMine] = useState("1");
  const mine = () => {
    client
      .mine({ blocks: parseInt(blocksToMine) })
      .then(() => {
        toast.success(`successfully mined ${blocksToMine} blocks`);
        refetchBlock();
      })
      .catch(handleTestClientError("mine()"));
  };

  const [setNextBlockTimestampValue, updateSetNextBlockTimestampValue] = useState("");
  const setNextBlockTimestamp = () => {
    client
      .setNextBlockTimestamp({ timestamp: BigInt(setNextBlockTimestampValue) })
      .then(() => {
        toast.success(`successfully set next block timestamp to ${setNextBlockTimestampValue}`);
        refetchBlock();
      })
      .catch(handleTestClientError("setNextBlockTimestamp()"));
  };

  const [setBalanceAddress, updateSetBalanceAddress] = useState("");
  const [setBalanceValue, updateSetBalanceValue] = useState("");
  const setBalance = () => {
    client
      .setBalance({ address: setBalanceAddress as Address, value: parseEther(setBalanceValue) })
      .then(() => toast.success("successfully setBalance"))
      .catch(handleTestClientError("setBalance()"));
  };

  return (
    <div className="container mx-auto max-w-[500px]">
      <h1 className="my-4 text-center text-2xl">Local Dev Page</h1>
      <div className="my-8">
        <h2 className="text-lg underline">Current Status</h2>
        <div>Block number: {isBlockLoading ? "..." : block?.number.toString()}</div>
        <div>Block timestamp: {isBlockLoading ? "..." : block?.timestamp.toString()}</div>
      </div>
      <InputGroup>
        <h3>Mine:</h3>
        <Input label="Blocks to mine:" value={blocksToMine} onValueChange={updateBlocksToMine} />
        <Button onPress={mine}>Mine Blocks</Button>
      </InputGroup>
      <InputGroup>
        <h3>Set Next Block Timestamp:</h3>
        <Input
          label="Timestamp:"
          value={setNextBlockTimestampValue}
          onValueChange={updateSetNextBlockTimestampValue}
        />
        <Button onPress={setNextBlockTimestamp}>Set Timestamp</Button>
      </InputGroup>
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
