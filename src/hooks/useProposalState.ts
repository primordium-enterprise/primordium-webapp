import PrimordiumGovernorV1Abi from "@/abi/PrimordiumGovernorV1.abi";
import { chainConfig } from "@/config/chainConfig";
import { defaultChain } from "@/config/wagmi-config";
import { GovernanceData, GovernanceDataQuery, ProposalListItemData } from "@/subgraph/subgraphQueries";
import { ProposalState, getProposalState } from "@/utils/proposalUtils";
import { useMemo, useState } from "react";
import { useQuery } from "urql";
import { useReadContract } from "wagmi";

export interface UseProposalStateReturn extends Omit<ReturnType<typeof useReadContract>, "data"> {
  state?: ProposalState;
  governanceData?: GovernanceData;
}

export default function useProposalState({
  proposal,
  block,
}: {
  proposal?: ProposalListItemData;
  block?: { number: bigint | string; timestamp: bigint | string };
}): UseProposalStateReturn {
  const [governanceDataResult] = useQuery({ query: GovernanceDataQuery });
  const { data: { governanceData } = {} }  = governanceDataResult;

  const state = useMemo(() => {
    return proposal && block && getProposalState(proposal, block, governanceData?.proposalGracePeriod);
  }, [proposal, block, governanceData]);

  // Query the state from the contract if the proposal is in the `VoteFinished` state.
  const { data: readState, ...readStateResult } = useReadContract({
    address: chainConfig[defaultChain.id]?.addresses.governor,
    abi: PrimordiumGovernorV1Abi,
    functionName: "state",
    args: [BigInt(proposal!.id)],
    query: {
      enabled: state === ProposalState.VoteFinished,
    },
  });

  return { state: readState || state, governanceData, ...readStateResult };
}
