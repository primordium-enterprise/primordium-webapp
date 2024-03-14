"use client";

import { UseProposalStateReturn } from "@/hooks/useProposalState";
import { ProposalState } from "@/utils/proposalUtils";
import { Chip, ChipProps } from "@nextui-org/react";
import { useMemo } from "react";

const proposalStateDisplays: {
  [key in ProposalState]: {
    text: string;
    color: ChipProps["color"];
    variant?: ChipProps["variant"];
  };
} = {
  [ProposalState.Pending]: {
    text: "Pending",
    color: "warning",
    variant: "flat",
  },
  [ProposalState.Active]: {
    text: "Active",
    color: "success",
    variant: "flat",
  },
  [ProposalState.Canceled]: {
    text: "Canceled",
    color: "warning",
    variant: "faded",
  },
  [ProposalState.Defeated]: {
    text: "Defeated",
    color: "danger",
  },
  [ProposalState.Succeeded]: {
    text: "Succeeded",
    color: "success",
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
  },
};

type Props = {
  proposalState: UseProposalStateReturn;
  className?: string;
} & Omit<ChipProps, "className">;

export default function ProposalStateSticker({ proposalState, className, ...props }: Props) {
  const { state } = proposalState;

  const [text, color, variant] = useMemo(() => {
    if (state === undefined) {
      return [];
    }
    const s = proposalStateDisplays[state];
    return [s.text, s.color, s.variant];
  }, [state]);

  return (
    state !== undefined && (
      <Chip {...props} color={color} radius="sm" variant={variant} className={className}>
        {text}
      </Chip>
    )
  );
}
