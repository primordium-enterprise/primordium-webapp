"use client";

import { Card, CardBody, Divider, Spinner } from "@nextui-org/react";
import AccountBalanceCards from "./_components/AccountBalanceCards";
import { useQuery } from "urql";
import { ProposalsQuery } from "@/subgraph/subgraphQueries";
import { useEffect, useMemo } from "react";
import ProposalListItem from "./_components/ProposalListItem";

export default function VotePage({ children }: { children: React.ReactNode }) {
  const [proposalsResult] = useQuery({
    query: ProposalsQuery,
    variables: { first: 1000, skip: 0 },
  });

  const {
    data: { proposals, _meta } = {},
    fetching: proposalsFetching,
    error: proposalsError,
  } = proposalsResult;
  useEffect(() => {
    if (proposalsError) {
      console.log(proposalsError);
    }
  }, [proposalsError]);

  return (
    <div className="text-xs xs:text-sm sm:p-4 sm:text-base">
      <div data-section="vote-header">
        <h1 className="mb-2 font-londrina-shadow text-3xl xs:text-4xl sm:mb-4 sm:text-5xl">
          Governance
        </h1>
        <p className="">
          PrimordiumDAO is owned and operated by MUSHI token holders. Tokens{" "}
          <b>
            <i>must</i>
          </b>{" "}
          be delegated to become eligible for voting on proposals. Each token holder can delegate
          their votes to themselves or to a third party.
        </p>
        <Divider className="xm:my-12 my-4 xs:my-8" />
        <AccountBalanceCards />
        <h2 className="my-4 font-londrina-shadow text-2xl xs:my-8 xs:text-3xl sm:text-4xl">
          Proposals
        </h2>
        <div className="my-4 flex flex-col gap-2 xs:my-8 sm:gap-3">
          {proposalsFetching ? (
            <Spinner size="lg" className="self-center" />
          ) : proposalsError ? (
            <Card>
              <CardBody>
                <h3 className="mb-2 font-londrina-solid text-xl xs:text-2xl">
                  Whoops! Failed to Load
                </h3>
                <p className="text-foreground-600">
                  There was an unexpected error loading the proposals. Please refresh the page to
                  try again, and check back later if the problem persists.
                </p>
              </CardBody>
            </Card>
          ) : (
            proposals &&
            (proposals.length > 0 ? (
              proposals.map((proposal) => (
                <ProposalListItem key={proposal.id} proposal={proposal} _meta={_meta!} />
              ))
            ) : (
              <Card>
                <CardBody>
                  <h3 className="mb-2 font-londrina-solid text-xl xs:text-2xl">No Proposals Yet!</h3>
                  <p className="text-foreground-600">
                    Proposals by Primordium members will appear here for delegates to vote on.
                  </p>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
