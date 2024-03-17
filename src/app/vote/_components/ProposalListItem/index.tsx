"use client";

import ProposalStateSticker from "@/components/ProposalStateSticker";
import useProposalState from "@/hooks/useProposalState";
import { MetaData, ProposalPartialData } from "@/subgraph/subgraphQueries";
import { Card, CardBody } from "@nextui-org/react";
import { useMemo } from "react";
import { ProposalState } from "@/utils/proposalUtils";
import { blocksToSeconds } from "@/utils/blockchainUtils";
import dayjs from "@/wrappers/dayjs";
import { ClockIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function ProposalListItem({
  proposal,
  _meta,
}: {
  proposal: ProposalPartialData;
  _meta: MetaData;
}) {
  const proposalIdString = useMemo(() => BigInt(proposal.id).toString(), [proposal]);

  const proposalState = useProposalState({ proposal, block: _meta.block });
  const { state, governanceData } = proposalState;

  const countdownDisplay = useMemo(() => {
    if (state === undefined) {
      return undefined;
    }

    const now = dayjs();
    const toFromNowString = (fromNow: bigint, isBlocks = false) => {
      let secondsFromNow = isBlocks ? blocksToSeconds(fromNow) : Number(fromNow);
      return now.add(secondsFromNow, "second").fromNow(true);
    };

    if (state === ProposalState.Pending) {
      return `Starts in ${toFromNowString(BigInt(proposal.voteStart) - BigInt(_meta.block.number), true)}`;
    } else if (state === ProposalState.Active) {
      return `Ends in ${toFromNowString(BigInt(proposal.voteEnd) - BigInt(_meta.block.number), true)}`;
    } else if (state === ProposalState.Succeeded && governanceData) {
      return `Expires in ${toFromNowString(BigInt(proposal.voteEnd) + BigInt(governanceData.proposalGracePeriod) - BigInt(_meta.block.number), true)}`;
    } else if (state === ProposalState.Queued) {
      const eta = dayjs.unix(Number(proposal.eta));
      if (now.isBefore(eta)) {
        return `Executable in ${eta.fromNow(true)}`;
      } else {
        const expires = eta.add(14, "days");
        return `Expires in ${expires.fromNow(true)}`;
      }
    }

    return undefined;
  }, [state, _meta, governanceData, proposal]);

  return (
    <Link href={`/vote/${proposalIdString}`}>
      <Card radius="sm">
        <CardBody className="gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold text-foreground-400 sm:text-xl">
                {proposalIdString}
              </div>
              <div className="font-medium">{proposal.title}</div>
            </div>
            <div className="flex items-center gap-2">
              {countdownDisplay && (
                <div className="hidden items-center gap-1 text-xs text-foreground-500 sm:flex">
                  <ClockIcon className="inline-block" /> <span>{countdownDisplay}</span>
                </div>
              )}
              <ProposalStateSticker proposalState={proposalState} />
            </div>
          </div>
          {countdownDisplay && (
            <div className="flex items-center justify-end gap-1 text-2xs text-foreground-500 sm:hidden">
              <ClockIcon className="inline-block" />
              <span>{countdownDisplay}</span>
            </div>
          )}
        </CardBody>
      </Card>
    </Link>
  );
}
