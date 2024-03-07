import { gql, TypedDocumentNode } from "urql";

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
`;

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

export const SettingsAndMetadataQuery = gql`
  query SettingsAndMetadataQuery() {
    executorData(id: "EXECUTOR_DATA") {
      sharesOnboarder
      minDelay
      id
      guard
      distributor
      balanceSharesManager
    }
    governanceData(id: "GOVERNANCE_DATA") {
      votingPeriod
      votingDelay
      totalSupply
      quorumBps
      proposalThresholdBps
      proposalGracePeriod
      proposalCount
      percentMajority
      maxSupply
      maxDeadlineExtension
      isFounded
      id
      governanceThresholdBps
      governanceCanBeginAt
      foundedAtTimestamp
      foundedAtBlock
      extensionPercentDecay
      extensionDecayPeriod
      baseDeadlineExtension
    }
    _meta {
      block {
        number
        timestamp
        hash
      }
    }
  }
`;
