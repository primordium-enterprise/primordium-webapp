"use client";

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

  const proposalStatusDisplay = useMemo(() => {
    if (proposal.state === "Active") {
      return "Active";
    } else if (proposal.state === "Queued") {
      return "Queued";
    } else if (proposal.state === "Executed") {
      return "Executed";
    } else if (proposal.state === "Canceled") {
      return "Canceled";
    } else {
      return "Unknown";
    }
  }, [proposal, _meta]);

  return (
    <Card radius="sm">
      <CardBody className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-14 text-center text-lg font-bold text-foreground-400 sm:w-16 sm:text-xl">
            {proposalIdDisplay}
          </div>
          <div className="font-medium">{proposal.title}</div>
        </div>
        <div></div>
      </CardBody>
    </Card>
  );
}
