"use client";

import { getEtherscanContract } from "@/fetch/etherscan";
import { GovernanceData } from "@/subgraph/subgraphQueries";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Abi, AbiParameter, Address, ContractFunctionArgs, Hex, isAddress } from "viem";

interface FunctionParam {
  type: AbiParameter["type"];
  name?: string;
}

export interface ProposalAction {
  target: Address;
  value: BigInt;
  signature?: string;
  calldata: Hex;
  abi?: Abi;
  functionName?: string;
  args?: ContractFunctionArgs[];
}

type ActionType = "function" | "value";
const actionTypeDisplays: {
  [key in ActionType]: string;
} = {
  function: "Function Call",
  value: "Value Transfer",
} as const;
const actionTypes = Object.keys(actionTypeDisplays) as ActionType[];

export default function ProposalActionsEditor({
  governanceData,
  actions,
  setActions,
}: {
  governanceData: GovernanceData | undefined;
  actions: ProposalAction[];
  setActions: Dispatch<SetStateAction<ProposalAction[]>>;
}) {
  const [isCreateActionModalOpen, setIsCreateActionModalOpen] = useState(false);

  const [target, setTarget] = useState("");
  const isTargetValid = useMemo(() => isAddress(target), [target]);

  const [value, setValue] = useState("");

  const [signature, setSignature] = useState("");

  const [functionName, setFunctionName] = useState("");

  const [args, setArgs] = useState<ContractFunctionArgs[]>([]);

  const [actionType, setActionType] = useState<ActionType>("function");

  const needsAbi = useMemo(() => actionType === "function", [actionType]);
  const {
    data: etherscanAbi,
    isLoading: isEtherscanAbiLoading,
    isFetched: isEtherscanAbiFetched,
    isError: isEtherscanAbiError,
  } = useQuery({
    queryKey: ["etherscanAbi", target],
    queryFn: ({ queryKey }) =>
      getEtherscanContract(queryKey[1] as Address).then((contract) => contract.parsedAbi),
    enabled: isTargetValid && needsAbi,
  });

  if (etherscanAbi) {
    console.log(etherscanAbi);
  }

  return (
    <div>
      <div className="my-2">
        {actions.length > 0 ? (
          actions.map((action, index) => (
            <div key={index}>
              <div>{action.target}</div>
              <div>{action.value.toString()}</div>
              <div>{action.signature}</div>
              <div>{action.functionName}</div>
            </div>
          ))
        ) : (
          <div className="text-foreground-500">No actions created yet.</div>
        )}
      </div>
      <Button
        className="mt-4"
        color="primary"
        fullWidth
        onPress={() => setIsCreateActionModalOpen(true)}
      >
        Add Proposal Action
      </Button>
      <Modal
        isOpen={isCreateActionModalOpen}
        onOpenChange={setIsCreateActionModalOpen}
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="font-londrina-solid text-xl sm:text-2xl">
            Create Proposal Action
          </ModalHeader>
          <ModalBody>
            <Select
              label="Action type:"
              selectedKeys={[actionType]}
              onChange={(e) => setActionType(e.target.value as ActionType)}
            >
              {actionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {actionTypeDisplays[type]}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Target address:"
              variant="bordered"
              placeholder="0x..."
              value={target}
              onValueChange={setTarget}
              isInvalid={target.length > 0 && !isTargetValid}
              isRequired
            />
            <Input
              label="Value (ETH):"
              variant="bordered"
              type="number"
              placeholder="0"
              value={value}
              onValueChange={setValue}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
