"use client";

import { getEtherscanContract } from "@/fetch/etherscan";
import { GovernanceData } from "@/subgraph/subgraphQueries";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Switch,
} from "@nextui-org/react";
import Input from "@/components/_nextui/InputExtended";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  Abi,
  AbiFunction,
  Address,
  ContractFunctionArgs,
  isAddress,
  toFunctionSignature,
} from "viem";
import { AbiFunctionOption, ProposalAction, ProposalActionType, actionTypeDisplays } from "./types";
import FunctionInputParams from "./components/FunctionInputParams";
import { getArrayComponents } from "@/utils/abi";
import CreateProposalActionModal from "./components/CreateProposalActionModal";



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

  return (
    <div>
      <div className="my-2">
        {actions.length > 0 ? (
          <>
            {actions.map((action, index) => (
              <div key={index}>
                <div>{action.target}</div>
                <div>{action.value.toString()}</div>
                <div>{action.signature}</div>
                <div>{action.functionName}</div>
              </div>
            ))}
          </>
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
      <CreateProposalActionModal
        isOpen={isCreateActionModalOpen}
        onOpenChange={setIsCreateActionModalOpen}
        placement="center"
        classNames={{
          wrapper: "overflow-hidden",
        }}
      />
    </div>
  );
}
