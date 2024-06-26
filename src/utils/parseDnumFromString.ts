import { Dnum, from } from "dnum";

export default function parseDnumFromString(value: string, decimals: number = 18): Dnum {
  if (!value) {
    value = "0"
  } else {
    let end = value.length - 1;
    if (value[end] == ".") {
      if (end === 0) {
        value = "0";
      } else {
        value = value.slice(0, end);
      }
    }
  }

  return from(value, decimals);
};