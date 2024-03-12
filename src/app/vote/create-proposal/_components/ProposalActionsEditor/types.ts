import { getArrayComponents, parseAbiInputValue } from "@/utils/abi";
import { Abi, AbiFunction, AbiParameter, Address, Hex } from "viem";

export type ProposalActionType = "function" | "value";

export interface ProposalAction {
  actionType: ProposalActionType;
  actionTypeDisplay?: string;
  target: Address;
  value: bigint;
  signature: string; // Should be an empty string for value transfers
  calldata: Hex; // Should be empty bytes "0x" for value transfers
  // Below only present for function calls
  abi?: [AbiFunction];
  abiFunctionInputParams?: AbiFunctionInputParam[];
}

export const actionTypeDisplays: {
  [key in ProposalActionType]: string;
} = {
  value: "ETH Transfer",
  function: "Function Call",
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

export const PROPOSAL_ACTIONS_STORAGE_KEY = "APP_create-proposal-actions";
