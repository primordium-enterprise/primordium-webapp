
export const bigintReplacer = (skipN = false) => (key: string, value: any): any => {
  if (typeof value === 'bigint') {
    return value.toString().concat(skipN ? '' : 'n');
  }
  return value;
}

/**
 * Helper utility to serialize data into JSON (including BigInts). BigInts are serialized as strings with a
 * trailing 'n' to indicate that they are BigInts.
 */
export const toJSON = <T = any>(value: T): string => {
  return JSON.stringify(value, bigintReplacer());
}

/**
 * Serializes without a trailing 'n' for BigInts.
 */
export const toJSONNoRevive = (value: any): string => {
  return JSON.stringify(value, bigintReplacer(true));
}

export const bigintReviver = (key: string, value: any): any => {
  if (typeof value === 'string' && /^\d+n$/.test(value)) {
    return BigInt(value.substring(0, value.length - 1));
  }
  return value;
}

export const fromJSON = <T = any>(json: string): T => {
  return JSON.parse(json, bigintReviver);
}