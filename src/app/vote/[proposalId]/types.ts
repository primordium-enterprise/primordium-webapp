export interface ProposalVotes {
  for: bigint;
  forDisplay: string;
  against: bigint;
  againstDisplay: string;
  abstain: bigint;
  abstainDisplay: string;
  totalCounted: bigint;
  towardsQuorum: bigint;
}