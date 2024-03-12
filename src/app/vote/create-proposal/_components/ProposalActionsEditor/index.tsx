"use client";

import { GovernanceData } from "@/subgraph/subgraphQueries";
import {
  Button
} from "@nextui-org/react";
import { Dispatch, SetStateAction, useState } from "react";
import { ProposalAction } from "./types";
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
        isDismissable={false}
      />
    </div>
  );
}
