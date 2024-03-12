import { isHex, padHex, size } from "viem";

/**
 * Returns the length and inner type of an ABI input parameter (or undefined if the input is not an array).
 * @param type The ABI type.
 * @returns An array containing the length (or null if dynamic) and inner type of the ABI input parameter, or undefined if the input is not an array.
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

/**
 * Parses the ABI input value based on the ABI singular type.
 * @param value The value to parse.
 * @param abiType The ABI type.
 * @returns The parsed value.
 * @throws Error if the provided value is empty, bool values are not 'true' or 'false', or the provided value is not a valid hex string.
 */
export const parseAbiInputValue = (value: string, abiType: string): string | boolean | bigint => {
  if (!value) {
    throw new Error("The provided value is empty.");
  }

  value = value.trim();

  // String type, return as is
  if (abiType.startsWith("string")) {
    return value;
  }

  // Bool should be written as "true" or "false"
  if (abiType.startsWith("bool")) {
    if (value === "true" || value === "false") {
      return value === "true" ? true : false;
    } else {
      throw new Error("bool values must be 'true' or 'false'.");
    }
  }

  // For bytes types, validate the hex string
  if (abiType.startsWith("bytes")) {
    if (!isHex(value, { strict: true })) {
      throw new Error("The provided value is not a valid hex string.");
    }
    // Pad the beginning byte with a zero if it's an odd length
    return value.length % 2 === 0 ? value : `0x0${value.split('0x')[1]}`;
  }

  // If the input matches a numeric (no decimals), return a BigInt
  let numericMatch = /^(-?\d+)$/.exec(value);
  if (numericMatch) {
    return BigInt(numericMatch[1]);
  }

  return value;
};
