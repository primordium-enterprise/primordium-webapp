"use client";

import PrimordiumGovernorV1Abi from "@/abi/PrimordiumGovernorV1.abi";
import PrimordiumTokenV1Abi from "@/abi/PrimordiumTokenV1.abi";
import WarningCard from "@/components/WarningCard";
import { chainConfig } from "@/config/chainConfig";
import { defaultChain } from "@/config/wagmi-config";
import { DelegateQuery, GovernanceDataQuery } from "@/subgraph/subgraphQueries";
import abbreviateBalance from "@/utils/abbreviateBalance";
import { ADDRESS_ZERO } from "@/utils/constants";
import { Card, CardBody, Link, Spinner } from "@nextui-org/react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "urql";
import { Address } from "viem";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import ProposalActionsEditor, { ProposalAction } from "./_components/ProposalActionsEditor";
import { sepolia } from "viem/chains";
import buildEtherscanURL from "@/utils/buildEtherscanURL";

export default function CreateProposalPage() {
  const { address } = useAccount();

  const [delegateResult] = useQuery({
    query: DelegateQuery,
    variables: { address: address as Address },
    pause: !address,
  });
  const {
    data: { delegate } = {},
    fetching: delegateFetching,
    error: delegateError,
  } = delegateResult;

  const [governanceDataResult] = useQuery({ query: GovernanceDataQuery });
  const {
    data: { governanceData, _meta } = {},
    fetching: governanceDataFetching,
    error: governanceDataError,
  } = governanceDataResult;

  useEffect(() => {
    if (governanceDataError) {
      console.error(governanceDataError);
    }
  }, [governanceDataError]);

  const { proposalThreshold, proposalThresholdPercentageDisplay, proposalThresholdDisplay } =
    useMemo(() => {
      let proposalThresholdBps;
      let proposalThresholdPercentageDisplay: JSX.Element | string = (
        <Link
          href={buildEtherscanURL(`address/${chainConfig[defaultChain.id].addresses.governor}#readProxyContract`)}
          isExternal
        >
          proposalThresholdBps()
        </Link>
      );
      let proposalThresholdDisplay;
      let proposalThreshold: bigint | undefined;
      if (governanceData) {
        proposalThresholdBps = Number(governanceData.proposalThresholdBps);
        proposalThresholdPercentageDisplay = `${proposalThresholdBps / 100}%`;
        proposalThreshold =
          (BigInt(governanceData.totalSupply) * BigInt(proposalThresholdBps)) / BigInt(10000);
        proposalThresholdDisplay = abbreviateBalance(proposalThreshold);
      }
      return {
        proposalThresholdBps,
        proposalThresholdPercentageDisplay,
        proposalThresholdDisplay,
        proposalThreshold,
      };
    }, [governanceData]);

  const [actions, setActions] = useState<ProposalAction[]>([]);

  return (
    <div data-section="create-proposal" className="text-xs xs:text-sm sm:p-4 sm:text-base">
      <h1 className="mb-2 font-londrina-shadow text-3xl xs:text-4xl sm:mb-4 sm:text-5xl">
        Create Proposal
      </h1>
      <div>
        {governanceDataFetching ? (
          <div className="flex justify-center items-center my-20">
            <Spinner size="lg" />
          </div>
        ) : governanceDataError ? (
          <p className="text-warning-400">
            There was an error when attempting to load the proposal submission settings.
          </p>
        ) : (
          <>
            <p>
              Unless you have the "proposer" role, you must have at least{" "}
              <b>{proposalThresholdPercentageDisplay}</b> of the total supply of MUSHI tokens
              delegated to your address to submit a proposal
              {proposalThresholdDisplay
                ? ` (which is currently about ${proposalThresholdDisplay} votes)`
                : ""}
              .
            </p>
            {BigInt((delegate && delegate.delegatedVotesBalance) || 0) <
              (proposalThreshold as bigint) && (
              <WarningCard className="mt-2 sm:mt-3">
                <p>
                  You do not have enough delegated votes to submit a proposal. You must have at
                  least {proposalThresholdDisplay} votes to submit a proposal.
                </p>
              </WarningCard>
            )}
            {governanceData && !governanceData.isFounded && (
              <WarningCard className="mt-2 sm:mt-3" color="primary">
                <p>
                  The governance contract has not been founded yet. The only allowable proposal
                  action is to found the governance contract.
                </p>
              </WarningCard>
            )}
            {governanceData &&
              _meta &&
              BigInt(_meta.block.timestamp) < BigInt(governanceData.governanceCanBeginAt) && (
                <WarningCard className="mt-2 sm:mt-3">
                  <p>
                    The governance contract cannot be founded until{" "}
                    <Link
                      href={`https://timestamp.online/countdown/${governanceData.governanceCanBeginAt}`}
                      isExternal
                    >
                      {governanceData.governanceCanBeginAt}
                    </Link>{" "}
                    UTC.
                  </p>
                </WarningCard>
              )}
          </>
        )}
      </div>
      <h3 className="mt-4 font-londrina-shadow text-xl xs:text-2xl sm:mt-6 sm:text-3xl">
        Proposal Actions
      </h3>
      <div className="mt-4 sm:mt-6">
        <ProposalActionsEditor
          governanceData={governanceData}
          actions={actions}
          setActions={setActions}
        />
      </div>
    </div>
  );
}
