import { format } from "dnum";

export default function abbreviateBalance(value: bigint, decimals: number, digits: number = 3) {
  return format([value, decimals], { digits, decimalsRounding: "ROUND_DOWN" });
}
