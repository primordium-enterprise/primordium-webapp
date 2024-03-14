"use client";

import BackButton from "@/components/BackButton";
import ProposalStateSticker from "@/components/ProposalStateSticker";
import useProposalState from "@/hooks/useProposalState";
import { ProposalQuery } from "@/subgraph/subgraphQueries";
import { Card, CardBody, Spinner } from "@nextui-org/react";
import { useEffect, useMemo } from "react";
import { useQuery } from "urql";
import { pad, toHex } from "viem";

export default function ProposalPage({
  params: { proposalId: proposalIdString },
}: {
  params: { proposalId: string };
}) {
  const proposalId = useMemo(() => BigInt(proposalIdString), [proposalIdString]);
  const proposalIdHex = useMemo(() => pad(toHex(proposalId)), [proposalId]);

  const [proposalResult, reexecute] = useQuery({ query: ProposalQuery, variables: { id: proposalIdHex } });
  const { data: { proposal, _meta } = {}, fetching: proposalFetching, error: proposalError } = proposalResult;

  useEffect(() => {
    window.setInterval(() => {
      console.log('re fetch');
      reexecute({ requestPolicy: 'network-only' });
    }, 3000);
  }, []);

  const proposalState = useProposalState({ proposal, block: _meta?.block });

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
            There was an unexpected error loading the proposal. Please refresh the page to
            try again, and check back later if the problem persists.
          </p>
        </CardBody>
      </Card>
      ) : !proposal && proposalFetching ? (
        <Spinner size="lg" className="self-center mt-4 sm:mt-6" />
      ) : proposal && (
        <h1 className="text-xl sm:text-2xl font-bold">{proposal.title}</h1>
      )}
      </div>
    </div>
  );
}
