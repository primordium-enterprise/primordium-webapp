import { ProposalListItemData } from "@/subgraph/subgraphQueries";
import { AVERAGE_SECONDS_PER_BLOCK } from "./constants";

export enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,

  // Custom states
  VoteFinished
}

const GRACE_PERIOD = BigInt(14 * 24 * 60 * 60); // 14 days in seconds

/**
 * Takes in a proposal item from the subgraph and the current block number and timestamp, returns the proposal state.
 * NOTE: A custom state `VoteFinished` is used to indicate that the proposal has finished voting. Additional
 * calculations or contract reads are required to determine the "Defeated" or "Succeeded" state.
 */
export const getProposalState = (
  proposal: ProposalListItemData,
  { number, timestamp }: { number: bigint | string; timestamp: bigint | string },
  proposalGracePeriod?: bigint | string
): ProposalState => {
  number = BigInt(number);
  timestamp = BigInt(timestamp);
  if (number < BigInt(proposal.voteStart)) {
    return ProposalState.Pending;
  } else if (number < BigInt(proposal.voteEnd)) {
    return ProposalState.Active;
  } else if (proposal.state === ProposalState.Canceled) {
    return ProposalState.Canceled;
  } else if (proposal.state === ProposalState.Queued) {
    if (timestamp >= BigInt(proposal.eta!) + GRACE_PERIOD) {
      return ProposalState.Expired;
    }
    return ProposalState.Queued;
  } else if (proposal.state !== ProposalState.Executed) {
    if (proposalGracePeriod) {
      proposalGracePeriod = BigInt(proposalGracePeriod);
      if (number > BigInt(proposal.voteEnd) + proposalGracePeriod) {
        return ProposalState.Expired;
      }
    }
    return ProposalState.VoteFinished;
  }

  return proposal.state;
};
