"use client";

import { ButtonProps, Card, CardBody } from "@nextui-org/react";
import { ProposalVotes } from "../../types";

const VoteCount = ({
  label,
  display,
  color,
}: {
  label: string;
  display: string;
  color: ButtonProps["color"];
}) => {
  return (
    <Card radius="sm">
      <CardBody className="flex flex-row gap-2 text-md sm:text-lg">
        <div className={`text-center font-medium text-${color!}-300`}>{label}</div>
        <div className={`text-center font-bold text-${color!}-400`}>{display}</div>
      </CardBody>
    </Card>
  );
};

export default function ProposalVoteCounts({ votes }: { votes: ProposalVotes }) {
  return (
    <div data-section="proposal-vote-counts" className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 justify-center items-center">
        <VoteCount label="For:" display={votes.forDisplay} color="success" />
        <VoteCount label="Against:" display={votes.againstDisplay} color="danger" />
        <VoteCount label="Abstain:" display={votes.abstainDisplay} color="default" />
      </div>
    </div>
  );
}
