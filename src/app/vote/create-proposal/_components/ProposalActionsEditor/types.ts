import { getArrayComponents, parseAbiInputValue } from "@/utils/abi";
import { Abi, AbiFunction, AbiParameter, Address, Hex } from "viem";

export type ProposalActionType = "function" | "value";

export interface ProposalAction<proposalActionType = ProposalActionType> {
  actionType: ProposalActionType;
  target: Address;
  value: BigInt;
  signature: string;
  calldata: Hex;
  abi: proposalActionType extends "value" ? undefined : [AbiFunction];
  abiFunctionInputParams: proposalActionType extends "value" ? undefined : AbiFunctionInputParam[];
}

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

export type AbiFunctionInputParam = {
  valueItems: AbiFunctionInputParamValueItem[];
  arrayComponents: ReturnType<typeof getArrayComponents>;
} & AbiParameter;

export interface AbiFunctionInputParamValueItem {
  value: string;
  parsedValue?: ReturnType<typeof parseAbiInputValue>;
  isInvalid?: boolean;
  errorMessage?: string;
}