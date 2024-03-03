import { gql } from "urql";

export const MemberQuery = gql`
  query Member($id: Bytes!) {
    member(id: $id) {
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
  query Delegate($id: Bytes!) {
    delegate(id: $id) {
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
