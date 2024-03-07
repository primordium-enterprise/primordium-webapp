import { Abi } from "viem";

/**
 * Filters the custom errors from the provided ABIs, and returns them combined in a single array.
 * @param abis The ABIs to combine the errors from.
 * @returns The combined ABI error items as a single array.
 */
export default function combineAbiErrors(...abis: Abi[]): any[] {
  type AbiItem = Abi[0];
  const combinedErrorsAbi: AbiItem[] = [];

  for (const abi of abis) {
    combinedErrorsAbi.push(...abi.filter((a) => a.type === "error"));
  }

  return combinedErrorsAbi;
}