import { format } from "dnum";

/**
 * Returns the string formatted balance of the provided BigInt value (formatted by dnum) with the given number of decimals and digits.
 * @param value A BigInt value to format.
 * @param decimals The number of decimals to use for formatting the BigInt into a string.
 * @param digits How many digits past the decimal point to include in the formatted string.
 * @returns Formatted string representation of the provided BigInt value.
 */
export default function abbreviateBalance(
  value: bigint,
  decimals: number = 18,
  digits: number = 3,
) {
  return format([value, decimals], { digits, decimalsRounding: "ROUND_DOWN" });
}
