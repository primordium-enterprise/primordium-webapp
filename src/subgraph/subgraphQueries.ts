import { gql, TypedDocumentNode } from "urql";
import { Address, Hash, Hex } from "viem";

export interface MetaData {
  block: {
    number: string;
    timestamp: string;
    hash: string;
  };
}

const MetaFragment = gql`
  fragment MetaFragment on _Meta_ {
    block {
      number
      timestamp
      hash
    }
  }
`;

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

export interface ProposalPartialData {
  id: string;
  state: number;
  clockMode: string;
  title: string;
  voteStart: string;
  voteEnd: string;
  originalVoteEnd: string;
  createdAtBlock: string;
  createdAtTimestamp: string;
  queuedAtBlock: string | null;
  queuedAtTimestamp: string | null;
  eta: string | null;
  executedAtBlock: string | null;
  executedAtTimestamp: string | null;
  canceledAtBlock: string | null;
  canceledAtTimestamp: string | null;
}

const ProposalPartialFragment = gql`
  fragment ProposalPartialFragment on Proposal {
    id
    state
    clockMode
    title
    voteStart
    voteEnd
    originalVoteEnd
    createdAtBlock
    createdAtTimestamp
    queuedAtBlock
    queuedAtTimestamp
    eta
    executedAtBlock
    executedAtTimestamp
    canceledAtBlock
    canceledAtTimestamp
  }
`;

export const ProposalsQuery = gql`
  query ProposalsQuery($first: Int!, $skip: Int!) {
    ${MetaFragment}
    ${ProposalPartialFragment}
    _meta { ...MetaFragment }
    proposals(first: $first, skip: $skip, orderBy: id, orderDirection: desc) {
      ...ProposalPartialFragment
    },

  }
` as TypedDocumentNode<
  {
    _meta: MetaData;
    proposals: ProposalPartialData[];
  },
  {
    first: number;
    skip: number;
  }
>;

type ProposalDelegateRoleData = {
  id: Address;
  delegatedVotesBalance: string;
  cancelerRoleExpiresAt: string;
  proposerRoleExpiresAt: string;
};

export interface ProposalData extends ProposalPartialData {
  description: string;
  createdTransactionHash: Hash;
  againstVotes: string;
  forVotes: string;
  abstainVotes: string;
  isCancelerRole: boolean;
  isProposerRole: boolean;
  proposer: ProposalDelegateRoleData;
  canceler: ProposalDelegateRoleData;
  targets: Address[];
  values: string[];
  calldatas: Hex[];
  signatures: string[];
  executedTransactionHash: Hash;
}

export const ProposalQuery = gql`
  query ProposalQuery($id: ID!) {
    ${MetaFragment}
    ${ProposalPartialFragment}
    _meta { ...MetaFragment }
    proposal(id: $id) {
      ...ProposalPartialFragment
      description
      createdTransactionHash
      againstVotes
      forVotes
      abstainVotes

      isCancelerRole
      isProposerRole
      proposer {
        id
        delegatedVotesBalance
        cancelerRoleExpiresAt
        proposerRoleExpiresAt
      }
      canceler {
        id
        delegatedVotesBalance
        cancelerRoleExpiresAt
        proposerRoleExpiresAt
      }
      targets
      values
      calldatas
      signatures
      executedTransactionHash
    }
  }
` as TypedDocumentNode<
  {
    _meta: MetaData;
    proposal: ProposalData;
  },
  {
    id: Hex;
  }
>;

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
    ${MetaFragment}
    _meta { ...MetaFragment }
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
  }
` as TypedDocumentNode<
  {
    governanceData: GovernanceData;
    _meta: MetaData;
  },
  undefined
>;
