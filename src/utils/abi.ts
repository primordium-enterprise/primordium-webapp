/**
 * Returns the length and inner type of an ABI input parameter (or undefined if the input is not an array).
 * @copyright Based off of function from Viem https://github.com/wevm/viem/blob/3123f50ffdc6275b82a01c209da90bcf631357c8/src/utils/abi/encodeAbiParameters.ts#L395 (MIT License)
 * @param type The ABI type.
 */
export function getArrayComponents(
  type: string,
): [length: number | null, innerType: string] | undefined {
  const matches = type.match(/^(.*)\[(\d+)?\]$/);
  return matches
    ? // Return `null` if the array is dynamic.
      [matches[2] ? Number(matches[2]) : null, matches[1]]
    : undefined;
}
