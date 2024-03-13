import { ProposalListItemData } from "@/subgraph/subgraphQueries";

export enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed
}

export const getProposalItemState = (proposal: ProposalListItemData, blockNumber: bigint): ProposalState => {
  if (proposal.state === "Active") {
    return ProposalState.Active;
  } else if (proposal.state === "Queued") {
    return ProposalState.Queued;
  } else if (proposal.state === "Executed") {
    return ProposalState.Executed;
  } else if (proposal.state === "Canceled") {
    return ProposalState.Canceled;
  } else {
    return ProposalState.Pending;
  }
}