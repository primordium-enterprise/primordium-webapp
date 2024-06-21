"use client";

import { GovernanceData } from "@/subgraph/subgraphQueries";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { AbiFunctionInputParam, PROPOSAL_ACTIONS_STORAGE_KEY, ProposalAction } from "./types";
import CreateProposalActionModal from "./components/CreateProposalActionModal";
import { toJSON } from "@/utils/JSONBigInt";
import ActionItem from "./components/ActionItem";
import ButtonExtended from "@/components/_nextui/ButtonExtended";
import { useConfig } from "wagmi";
import toast from "react-hot-toast";
import { readContract } from "wagmi/actions";
import PrimordiumGovernorV1Abi from "@/abi/PrimordiumGovernorV1.abi";
import chainConfig from "@/config/chainConfig";
import { AbiFunction, encodeFunctionData, toFunctionSignature } from "viem";

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

  const config = useConfig();

  const addProposalAction = (newAction: ProposalAction) => {
    setActions((currentActions) => {
      let newActions = [...currentActions, newAction];
      window.sessionStorage.setItem(PROPOSAL_ACTIONS_STORAGE_KEY, toJSON(newActions));
      return newActions;
    });
    setIsCreateActionModalOpen(false);
  };

  const needsFounding = useMemo(() => !governanceData?.isFounded, [governanceData]);

  const hasFoundGovernorAction = useMemo(() => {
    return (
      needsFounding &&
      actions.some(
        (action) =>
          action.signature === "foundGovernor(uint256)" &&
          action.target === chainConfig.addresses.governor,
      )
    );
  }, [needsFounding, actions]);

  const [isProposalCountLoading, setIsProposalCountLoading] = useState(false);
  const createFoundGovernorAction = async () => {
    setIsProposalCountLoading(true);

    try {
      const abi = PrimordiumGovernorV1Abi;
      const address = chainConfig.addresses.governor;
      if (!address) {
        throw { shortMessage: "Governor address not found on this chain." };
      }

      // Retrieve the current proposal count
      const proposalCount = await readContract(config, {
        abi,
        address,
        functionName: "proposalCount",
      });

      // ProposalID will be current count + 1
      const proposalId = proposalCount + BigInt(1);

      const abiFunction = abi.find(
        (param) => param.type === "function" && param.name === "foundGovernor",
      ) as AbiFunction;

      // Generate inputParams for displaying the action
      const inputParams: AbiFunctionInputParam[] = [
        {
          ...abiFunction.inputs[0],
          valueItems: [
            {
              value: proposalId.toString(),
              parsedValue: proposalId,
              isInvalid: false,
              errorMessage: "",
            },
          ],
          arrayComponents: undefined,
        },
      ];

      const action: ProposalAction = {
        actionType: "function",
        actionTypeDisplay: "Found Governor",
        target: address,
        value: BigInt(0),
        signature: toFunctionSignature(abiFunction),
        calldata: encodeFunctionData({
          abi,
          functionName: "foundGovernor",
          args: [proposalId],
        }),
        abi: [abiFunction],
        abiFunctionInputParams: inputParams,
      };

      addProposalAction(action);
    } catch (e: any) {
      toast.error(e?.shortMessage || "Failed to create 'Found Governor' action at this time.");
    }

    setIsProposalCountLoading(false);
  };

  return (
    <div>
      <div className="my-2 ml-0 flex flex-col gap-2 sm:ml-6 sm:gap-4">
        {actions.length > 0 ? (
          <>
            {actions.map((action, index) => (
              <ActionItem
                key={index}
                action={action}
                index={index}
                removeAction={() => {
                  setActions((currentActions) => {
                    let newActions = [...currentActions];
                    newActions.splice(index, 1);
                    window.sessionStorage.setItem(PROPOSAL_ACTIONS_STORAGE_KEY, toJSON(newActions));
                    return newActions;
                  });
                }}
              />
            ))}
          </>
        ) : (
          <div className="text-foreground-500">No actions created yet.</div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <ButtonExtended
          color="primary"
          variant={needsFounding ? "bordered" : "solid"}
          onPress={() => setIsCreateActionModalOpen(true)}
          isDisabled={hasFoundGovernorAction}
        >
          Add Proposal Action
        </ButtonExtended>
        {needsFounding && (
          <ButtonExtended
            color="primary"
            onPress={createFoundGovernorAction}
            isLoading={isProposalCountLoading}
            isDisabled={hasFoundGovernorAction}
          >
            {`Add "Found Governor" Action`}
          </ButtonExtended>
        )}
      </div>
      <CreateProposalActionModal
        addProposalAction={addProposalAction}
        isOpen={isCreateActionModalOpen}
        onOpenChange={setIsCreateActionModalOpen}
        placement="center"
        classNames={{
          wrapper: "overflow-hidden",
        }}
        isDismissable={false}
      />
    </div>
  );
}
