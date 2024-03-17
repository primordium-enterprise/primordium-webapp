import chainConfig from "@/config/chainConfig";
import { Address } from "viem";
import { useReadContract } from "wagmi";

// export default function useGovernanceFoundingVoteThreshold(
//   governor: Address = chainConfig.governor.address,
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
