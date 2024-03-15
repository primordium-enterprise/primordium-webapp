"use client";

import { ProposalData } from "@/subgraph/subgraphQueries";
import { useMemo } from "react";
import { decodeAbiParameters, decodeFunctionData, parseAbiParameters } from "viem";

export default function ProposalActionsDisplay({ proposal }: { proposal?: ProposalData }) {
  const actions = useMemo(() => {
    if (!proposal) return [];
    return proposal.targets.map((target, i) => {
      let action = {
        target,
        value: BigInt(proposal.values[i]),
        signature: proposal.signatures[i],
        calldata: proposal.calldatas[i],
      };

      if (action.signature) {
        try {
          let [name, types] = action.signature.substring(0, action.signature.length - 1).split("(");

          console.log(name, types);

          let inputs = parseAbiParameters(types);
          let decoded = decodeFunctionData({
            abi: [
              {
                type: "function",
                name,
                inputs,
              },
            ],
            data: action.calldata,
          });
          console.log(decoded);
        } catch (e) {
          console.log(e);
        }
      }
    });
  }, [proposal]);

  return <div></div>;
}
