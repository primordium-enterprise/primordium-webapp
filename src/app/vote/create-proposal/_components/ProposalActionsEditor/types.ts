import { getArrayComponents } from "@/utils/abi";
import { Abi, AbiFunction, Address, Hex } from "viem";

export interface ProposalAction {
  target: Address;
  value: BigInt;
  signature?: string;
  calldata: Hex;
  abi?: Abi;
  functionName?: string;
}

export type ProposalActionType = "function" | "value";

export const actionTypeDisplays: {
  [key in ProposalActionType]: string;
} = {
  function: "Function Call",
  value: "Value Transfer",
} as const;

export interface AbiFunctionOption extends AbiFunction {
  signature: string;
  arrayComponentsByInputIndex: {
    [index: number]: ReturnType<typeof getArrayComponents>;
  }
}

