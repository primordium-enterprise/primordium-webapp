"use client";

import { GovernanceData } from "@/subgraph/subgraphQueries";
import { Button, Card, CardBody } from "@nextui-org/react";
import { Dispatch, SetStateAction, useState } from "react";
import { PROPOSAL_ACTIONS_STORAGE_KEY, ProposalAction } from "./types";
import CreateProposalActionModal from "./components/CreateProposalActionModal";
import { toJSON } from "@/utils/JSONBigInt";
import ActionItem from "./components/ActionItem";
import ButtonExtended from "@/components/_nextui/ButtonExtended";

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
      <div className="my-2 flex flex-col gap-2 sm:gap-4 ml-0 sm:ml-6">
        {actions.length > 0 ? (
          <>
            {actions.map((action, index) => (
              <ActionItem key={index} action={action} index={index} removeAction={() => {
                setActions((currentActions) => {
                  let newActions = [...currentActions];
                  newActions.splice(index, 1);
                  window.sessionStorage.setItem(PROPOSAL_ACTIONS_STORAGE_KEY, toJSON(newActions));
                  return newActions;
                });
              }}/>
            ))}
          </>
        ) : (
          <div className="text-foreground-500">No actions created yet.</div>
        )}
      </div>
      <div className="flex justify-end">
        <ButtonExtended
          className="mt-4"
          color="primary"
          onPress={() => setIsCreateActionModalOpen(true)}
        >
          Add Proposal Action
        </ButtonExtended>
      </div>
      <CreateProposalActionModal
        addProposalAction={(newAction) => {
          setActions((currentActions) => {
            let newActions = [...currentActions, newAction];
            window.sessionStorage.setItem(PROPOSAL_ACTIONS_STORAGE_KEY, toJSON(newActions));
            return newActions;
          });
          setIsCreateActionModalOpen(false);
        }}
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
