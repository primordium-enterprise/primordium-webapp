"use client";

import BackButton from "@/components/BackButton";
import DisplayAddress from "@/components/DisplayAddress";
import ProposalStateSticker from "@/components/ProposalStateSticker";
import ButtonExtended from "@/components/_nextui/ButtonExtended";
import useProposalState from "@/hooks/useProposalState";
import { ProposalQuery } from "@/subgraph/subgraphQueries";
import buildEtherscanURL from "@/utils/buildEtherscanURL";
import { ProposalState } from "@/utils/proposalUtils";
import { Card, CardBody, Link, Spinner } from "@nextui-org/react";
import { useEffect, useMemo } from "react";
import { useQuery } from "urql";
import { pad, toHex } from "viem";
import ProposalBlockTimeDisplay from "./_components/ProposalBlockTimeDisplay";
import { useRouter } from "next/navigation";
import abbreviateBalance from "@/utils/abbreviateBalance";
import { ProposalVotes } from "./types";
import ProposalVoteCounts from "./_components/ProposalVoteCounts";

export default function ProposalPage({
  params: { proposalId: proposalIdString },
}: {
  params: { proposalId: string };
}) {
  const router = useRouter();

  const proposalId = useMemo(() => BigInt(proposalIdString), [proposalIdString]);
  const proposalIdHex = useMemo(() => pad(toHex(proposalId)), [proposalId]);

  const [proposalResult] = useQuery({
    query: ProposalQuery,
    variables: { id: proposalIdHex },
  });
  const {
    data: { proposal, _meta } = {},
    fetching: proposalFetching,
    error: proposalError,
  } = proposalResult;

  useEffect(() => {
    if (proposalError) {
      console.log(proposalError);
    }
  }, [proposalError]);

  // Navigate back to the vote page if the proposal is not found
  useEffect(() => {
    if (!proposalFetching && !proposalError && proposal === null) {
      router.replace("/vote");
    }
  }, [proposal, proposalFetching, proposalError]);

  const proposalState = useProposalState({ proposal, block: _meta?.block });
  const { state, governanceData } = proposalState;

  // Format the vote totals
  const votes = useMemo(() => {
    if (!proposal) {
      return undefined;
    }
    const v: ProposalVotes = {
      for: BigInt(proposal.forVotes),
      against: BigInt(proposal.againstVotes),
      abstain: BigInt(proposal.abstainVotes),
    } as ProposalVotes;
    v.forDisplay = abbreviateBalance(v.for);
    v.againstDisplay = abbreviateBalance(v.against);
    v.abstainDisplay = abbreviateBalance(v.abstain);
    v.totalCounted = v.for + v.against;
    v.towardsQuorum = v.for + v.abstain;
    return v;
  }, [proposal]);

  return (
    <div
      data-section="proposal-details"
      className="flex flex-col gap-2 pb-8 text-xs xs:text-sm sm:p-4 sm:pb-12 sm:text-base"
    >
      <BackButton href="/vote" />
      <div className="flex items-center gap-4 sm:gap-5">
        <h3 className="font-londrina-shadow text-lg text-foreground-600 xs:text-xl sm:text-2xl">
          Proposal {proposalIdString}
        </h3>
        {proposal && <ProposalStateSticker proposalState={proposalState} />}
      </div>
      <div className="flex flex-col gap-2">
        {proposalError ? (
          <Card>
            <CardBody>
              <h3 className="mb-2 font-londrina-solid text-xl xs:text-2xl">
                Whoops! Failed to Load
              </h3>
              <p className="text-foreground-600">
                There was an unexpected error loading the proposal. Please refresh the page to try
                again, and check back later if the problem persists.
              </p>
            </CardBody>
          </Card>
        ) : !proposal && proposalFetching ? (
          <Spinner size="lg" className="mt-4 self-center sm:mt-6" />
        ) : (
          proposal && (
            <>
              <h1 className="text-xl font-bold sm:text-2xl">{proposal.title}</h1>
              <div className="flex flex-col justify-between text-2xs sm:flex-row sm:text-xs">
                <p className="text-foreground-500">
                  Proposed by <DisplayAddress address={proposal.proposer.id} enableClickToCopy />
                </p>
                <Link
                  href={buildEtherscanURL(`tx/${proposal.createdTransactionHash}`)}
                  isExternal
                  showAnchorIcon
                >
                  View tx
                </Link>
              </div>
              <div className="mt-4 flex flex-col gap-4">
                {state === ProposalState.Active && (
                  <div className="flex justify-end">
                    <ButtonExtended color="primary">Submit Vote</ButtonExtended>
                  </div>
                )}
                {state !== ProposalState.Pending && (
                  <>
                    {votes && <ProposalVoteCounts votes={votes} />}
                  </>
                )}
                <div className="flex flex-col gap-4">
                  <ProposalBlockTimeDisplay
                    currentBlockNumber={_meta!.block.number}
                    blockString={proposal.voteStart}
                    label="Voting Starts at Block:"
                  />
                  <ProposalBlockTimeDisplay
                    currentBlockNumber={_meta!.block.number}
                    blockString={proposal.voteEnd}
                    label="Voting Ends at Block:"
                  />
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
