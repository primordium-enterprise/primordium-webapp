import { Address, pad } from "viem";

export const ADDRESS_ZERO: Address = pad("0x", { size: 20 });
export const governanceThresholdBps = 1000;