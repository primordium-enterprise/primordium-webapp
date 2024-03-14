'use client'

import { UseProposalStateReturn } from "@/hooks/useProposalState";
import { ProposalState } from "@/utils/proposalUtils";
import { Chip, ChipProps } from "@nextui-org/react";
import { useMemo } from "react";

const proposalStateDisplays: {
  [key in ProposalState]: {
    text: string;
    color: ChipProps["color"];
    bordered?: boolean;
  };
} = {
  [ProposalState.Pending]: {
    text: "Pending",
    color: "warning",
  },
  [ProposalState.Active]: {
    text: "Active",
    color: "success",
  },
  [ProposalState.Canceled]: {
    text: "Canceled",
    color: "warning",
  },
  [ProposalState.Defeated]: {
    text: "Defeated",
    color: "danger",
    bordered: true,
  },
  [ProposalState.Succeeded]: {
    text: "Succeeded",
    color: "success",
    bordered: true,
  },
  [ProposalState.Queued]: {
    text: "Queued",
    color: "secondary",
  },
  [ProposalState.Expired]: {
    text: "Expired",
    color: "default",
  },
  [ProposalState.Executed]: {
    text: "Executed",
    color: "secondary",
  },
  [ProposalState.VoteFinished]: {
    text: "Voting Complete",
    color: "default",
  }
};


type Props = {
  proposalState: UseProposalStateReturn;
  className?: string;
} & Omit<ChipProps, "className">;

export default function ProposalStateSticker({
  proposalState,
  className,
  ...props
}: Props) {
  const { state } = proposalState;

  return state !== undefined && (
    <Chip {...props} color={proposalStateDisplays[state].color} radius="sm">
      {proposalStateDisplays[state].text}
    </Chip>
  );
}