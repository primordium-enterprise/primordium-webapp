"use client";

import ProposalStateSticker from "@/components/ProposalStateSticker";
import useProposalState from "@/hooks/useProposalState";
import { MetaData, ProposalListItemData } from "@/subgraph/subgraphQueries";
import { Card, CardBody } from "@nextui-org/react";
import { useMemo } from "react";

export default function ProposalListItem({
  proposal,
  _meta,
}: {
  proposal: ProposalListItemData;
  _meta: MetaData;
}) {
  const proposalIdDisplay = useMemo(() => BigInt(proposal.id).toString(), [proposal]);

  const proposalState = useProposalState({ proposal, block: _meta.block });

  return (
    <Card radius="sm">
      <CardBody>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-14 text-center text-lg font-bold text-foreground-400 sm:w-16 sm:text-xl">
              {proposalIdDisplay}
            </div>
            <div className="font-medium">{proposal.title}</div>
          </div>
          <div>
            <ProposalStateSticker proposalState={proposalState} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
