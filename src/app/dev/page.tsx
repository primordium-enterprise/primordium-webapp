"use client";

import { Button, ButtonGroup, Input } from "@nextui-org/react";
import { notFound } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Address, createTestClient, http, parseEther, publicActions } from "viem";
import { foundry } from "viem/chains";
import styles from "./dev.module.css";
import { useBlock, useBlockNumber } from "wagmi";
import { CheckIcon, CopyIcon, Cross2Icon, TrashIcon } from "@radix-ui/react-icons";

const handleTestClientError = (handler: string) => (error: any) => {
  console.log(error);
  toast.error(handler + " failed");
};

const InputGroup = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.inputGroup}>{children}</div>;
};

const ANVIL_STATES_KEY = "anvilStates";

interface AnvilStateItem {
  name: string;
  state: `0x${string}`;
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
      }).extend(publicActions),
    [],
  );

  useEffect(() => {
    if (client) {
      client.getBlock().then(console.log);
    }
  }, [client])

  const {
    data: block,
    isLoading: isBlockLoading,
    refetch: refetchBlock,
  } = useBlock({ watch: true });

  const [isAutomine, setIsAutomine] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    if (client) {
      client.getAutomine().then(setIsAutomine);
    }
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

  const [anvilStates, updateAnvilStates] = useState<AnvilStateItem[]>([]);
  useEffect(() => {
    let stored = window.localStorage.getItem(ANVIL_STATES_KEY);
    updateAnvilStates(stored ? JSON.parse(stored) : []);
  }, []);

  const [dumpStateName, updateDumpStateName] = useState("");
  const dumpState = () => {
    if (!dumpStateName) {
      return toast.error("dump state requires a name");
    }

    if (anvilStates.find((item) => item.name == dumpStateName)) {
      return toast.error("dump state name already exists");
    }

    client.dumpState().then((state) => {
      let newStates = [...anvilStates, { name: dumpStateName, state }];
      updateAnvilStates(newStates);
      window.localStorage.setItem(ANVIL_STATES_KEY, JSON.stringify(newStates));
      updateDumpStateName("");
    });
  };

  const removeAnvilStateItem = (index: number) => {
    let newStates = Array.from(anvilStates);
    newStates.splice(index, 1);
    updateAnvilStates(newStates);
    window.localStorage.setItem(ANVIL_STATES_KEY, JSON.stringify(newStates));
  };

  const loadState = (stateItem: AnvilStateItem) => {
    client
      .loadState({ state: stateItem.state })
      .then(() => {
        toast.success(`successfully loaded state: ${stateItem.name}`);
      })
      .catch(handleTestClientError(`loadState()`));
  };

  const [confirmStateItemIndex, updateConfirmStateItemIndex] = useState<number | undefined>();

  const [getNonceValue, updateGetNonceValue] = useState("");
  const getNonce = () => {
    client
      .getTransactionCount({ address: getNonceValue as Address })
      .then((count) => {
        toast(`Account nonce: ${count}`);
      })
      .catch(handleTestClientError("getNonce()"));
  };

  return (
    <div className="container mx-auto max-w-[500px]">
      <h1 className="my-4 text-center text-2xl">Local Dev Page</h1>
      <div className="my-8">
        <h2 className="text-lg underline">Current Status</h2>
        <div>Block number: {isBlockLoading ? "..." : block?.number.toString()}</div>
        <div>Block timestamp: {isBlockLoading ? "..." : block?.timestamp.toString()}</div>
        <div>Is automine?: {isAutomine === undefined ? "..." : isAutomine ? "true" : "false"}</div>
      </div>
      <InputGroup>
        <h3>Mine:</h3>
        <Input label="Blocks to mine:" value={blocksToMine} onValueChange={updateBlocksToMine} />
        <Button onPress={mine} color="primary">
          Mine Blocks
        </Button>
      </InputGroup>
      <InputGroup>
        <h3>Set Next Block Timestamp:</h3>
        <Input
          label="Timestamp:"
          value={setNextBlockTimestampValue}
          onValueChange={updateSetNextBlockTimestampValue}
        />
        <Button onPress={setNextBlockTimestamp} color="primary">
          Set Timestamp
        </Button>
      </InputGroup>
      <InputGroup>
        <h3>Set Balance:</h3>
        <Input label="Address:" value={setBalanceAddress} onValueChange={updateSetBalanceAddress} />
        <Input
          label="Balance (ETH):"
          value={setBalanceValue}
          onValueChange={updateSetBalanceValue}
        />
        <Button onPress={setBalance} color="primary">
          Set Balance
        </Button>
      </InputGroup>
      <InputGroup>
        <h3>Dump State:</h3>
        <Input label="State name:" value={dumpStateName} onValueChange={updateDumpStateName} />
        <Button onPress={dumpState} color="primary">
          Dump State
        </Button>
      </InputGroup>
      <InputGroup>
        <h3>Stored States:</h3>
        {anvilStates.map((stateItem, index) => (
          <div className="flex justify-between" key={stateItem.name}>
            <div className="text-foreground-500">{stateItem.name}</div>
            <ButtonGroup size="sm">
              {index === confirmStateItemIndex ? (
                <>
                  <Button onPress={() => updateConfirmStateItemIndex(undefined)} variant="ghost">
                    <Cross2Icon />
                  </Button>
                  <Button color="danger" onPress={() => removeAnvilStateItem(index)}>
                    <CheckIcon />
                  </Button>
                </>
              ) : (
                <>
                  <Button onPress={() => loadState(stateItem)} color="primary">
                    Load
                  </Button>
                  <Button
                    onPress={() => {
                      navigator.clipboard.writeText(stateItem.state);
                      toast.success("Copied state!");
                    }}
                  >
                    <CopyIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    color="danger"
                    onPress={() => updateConfirmStateItemIndex(index)}
                  >
                    <TrashIcon />
                  </Button>
                </>
              )}
            </ButtonGroup>
          </div>
        ))}
      </InputGroup>
      <InputGroup>
        <h3>Get Address Nonce:</h3>
        <Input label="Address:" value={getNonceValue} onValueChange={updateGetNonceValue} />
        <Button onPress={getNonce}>Get Nonce</Button>
      </InputGroup>
    </div>
  );
}
