import { gql, TypedDocumentNode } from "urql";
import { Address } from "viem";

export const MemberQuery = gql`
  query Member($address: Bytes!) {
    member(id: $address) {
      delegate {
        id
        delegatedVotesBalance
      }
      id
      tokenBalance
    }
  }
`;

export const DelegateQuery = gql`
  query Delegate($address: Bytes!) {
    delegate(id: $address) {
      id
      delegatedVotesBalance
      proposerRoleExpiresAt
      cancelerRoleExpiresAt
      membersRepresented {
        tokenBalance
        id
      }
    }
  }
` as TypedDocumentNode<
  {
    delegate: {
      id: string;
      delegatedVotesBalance: string;
      proposerRoleExpiresAt: string;
      cancelerRoleExpiresAt: string;
      membersRepresented: { id: string; tokenBalance: string }[];
    } | null;
  },
  { address: Address }
>;

export const MemberPlusDelegateQuery = gql`
  query MemberPlusDelegateQuery($address: Bytes!) {
    member(id: $address) {
      delegate {
        id
        delegatedVotesBalance
      }
      id
      tokenBalance
    }
    delegate(id: $address) {
      id
      delegatedVotesBalance
      proposerRoleExpiresAt
      cancelerRoleExpiresAt
    }
  }
`;

export interface GovernanceData {
  id: string;
  totalSupply: string;
  maxSupply: string;
  proposalCount: string;
  proposalThresholdBps: number;
  quorumBps: number;
  proposalGracePeriod: string;
  governanceCanBeginAt: string;
  governanceThresholdBps: number;
  isFounded: boolean;
  foundedAtBlock: string;
  foundedAtTimestamp: string;
  votingDelay: string;
  votingPeriod: string;
  percentMajority: number;
  maxDeadlineExtension: string;
  baseDeadlineExtension: string;
  extensionDecayPeriod: string;
  extensionPercentDecay: number;
  balanceSharesManager: string;
  sharesOnboarder: string;
  distributor: string;
  guard: string;
  executorMinDelay: string;
}

export const GovernanceDataQuery = gql`
  query GovernanceDataQuery() {
    governanceData(id: "GOVERNANCE_DATA") {
      id
      totalSupply
      maxSupply
      proposalCount
      proposalThresholdBps
      quorumBps
      proposalGracePeriod
      governanceCanBeginAt
      governanceThresholdBps
      isFounded
      foundedAtBlock
      foundedAtTimestamp
      votingDelay
      votingPeriod
      percentMajority
      maxDeadlineExtension
      baseDeadlineExtension
      extensionDecayPeriod
      extensionPercentDecay
      balanceSharesManager
      sharesOnboarder
      distributor
      guard
      executorMinDelay
    }
    _meta {
      block {
        number
        timestamp
        hash
      }
    }
  }
` as TypedDocumentNode<
  {
    governanceData: GovernanceData;
    _meta: {
      block: {
        number: string;
        timestamp: string;
        hash: string;
      };
    };
  },
  undefined
>;
