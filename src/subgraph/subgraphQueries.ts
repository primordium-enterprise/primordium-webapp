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
