import { AVERAGE_SECONDS_PER_BLOCK } from "./constants";

const avgSecondsPerBlock = BigInt(AVERAGE_SECONDS_PER_BLOCK);
export const blocksToSeconds = (blocks: bigint): number => {
  return Number(blocks * avgSecondsPerBlock);
};