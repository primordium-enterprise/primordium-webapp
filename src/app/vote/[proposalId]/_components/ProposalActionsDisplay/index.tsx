"use client";

import DisplayAddress from "@/components/DisplayAddress";
import { ProposalData } from "@/subgraph/subgraphQueries";
import { toJSONNoRevive } from "@/utils/JSONBigInt";
import shortenAddress from "@/utils/shortenAddress";
import { copyText } from "@/utils/toasts";
import { CopyIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import {
  Address,
  Hex,
  decodeAbiParameters,
  decodeFunctionData,
  formatEther,
  parseAbiParameters,
  parseEther,
  size,
} from "viem";

interface Action {
  target: Address;
  value: bigint;
  formattedValue: string;
  signature: string;
  calldata: Hex;
  calldataSize: number;
  args: string[];
  functionName?: string;
  decodeError?: boolean;
}

export default function ProposalActionsDisplay({ proposal }: { proposal?: ProposalData }) {
  const actions = useMemo(() => {
    if (!proposal) return [];
    return proposal.targets.map((target, i) => {
      let action: Action = {
        target,
        value: BigInt(proposal.values[i]),
        formattedValue: formatEther(BigInt(proposal.values[i])),
        signature: proposal.signatures[i],
        calldata: proposal.calldatas[i],
        calldataSize: size(proposal.calldatas[i]),
        args: [],
      };

      try {
        if (action.signature) {
          let [name, types] = action.signature.substring(0, action.signature.length - 1).split("(");

          action.functionName = name;

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

          action.args = decoded.args?.map((a) => JSON.stringify(a, (key, value) => {
            if (typeof value === "bigint") return Number(value);
          })) || [];
        } else {
          if (action.calldataSize === 0) {
            action.functionName = "transfer";
            action.args = [`${formatEther(action.value)} ETH`];
          } else {
            action.decodeError = true;
          }
        }
      } catch (e) {
        console.log(e);
        action.decodeError = true;
      }

      return action;
    });
  }, [proposal]);

  return (
    <ol className="list-inside list-decimal text-xs sm:text-sm">
      {actions.map((action, i) => {
        return (
          <li key={i}>
            {action.decodeError ? (
              <>
                <div>Target: {action.target}</div>
                <div>Value: {formatEther(action.value)} ETH</div>
                <div>Signature: {action.signature}</div>
                <div className="flex gap-2">
                  Calldata: {shortenAddress(action.calldata)}{" "}
                  <CopyIcon
                    className="hover:cursor-pointer"
                    onClick={() => copyText(action.calldata)}
                  />
                </div>
              </>
            ) : (
              <>
                <span>
                  <DisplayAddress address={action.target} skipEns enableClickToCopy />
                  {"."}
                  {action.functionName}
                </span>
                {action.value && <span>{`{${action.formattedValue}}`}</span>}
                <span>{"("}</span>
                {action.args.map((arg, j) => (
                  <span key={`${j}-${arg}`}>
                    <br />
                    <span>&emsp;{arg}</span>
                  </span>
                ))}
                {action.args.length > 0 && <br />}
                <span>{")"}</span>
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}
