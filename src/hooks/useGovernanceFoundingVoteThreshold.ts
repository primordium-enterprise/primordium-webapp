import {primordiumAddresses} from "@/config/addresses";
import { Address } from "viem";
import { useReadContract } from "wagmi";

// export default function useGovernanceFoundingVoteThreshold(
//   governor: Address = primordiumAddresses.governor.address,
// ) {
//   const result = useReadContract({
//     address: governor,
//     abi: [
//       {
//         type: "function",
//         name: "governanceFoundingVoteThreshold",
//         stateMutability: "view",
//         inputs: [],
//         outputs: [{ type: "uint256" }],
//       },
//     ],
//     functionName: "governanceFoundingVoteThreshold",
//   });

//   return { governanceFoundingVoteThreshold: result.data, ...result };
// }
