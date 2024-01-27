
export const bigintReplacer = (key: string, value: any): any => {
  if (typeof value === 'bigint') {
    return value.toString().concat('n');
  }
  return value;
}

export const toJSON = <T = any>(value: T): string => {
  return JSON.stringify(value, bigintReplacer);
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