import { Address, pad } from "viem";

export const ADDRESS_ZERO: Address = pad("0x", { size: 20 });
export const SAFE_CONFIRMATIONS: number = 12;
export const governanceThresholdBps = BigInt(2000);
export const maxSupply = BigInt("10000000000000000000000000"); // 10 million