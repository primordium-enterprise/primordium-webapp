import { gql } from "urql";

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
`