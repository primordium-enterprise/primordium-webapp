"use client";

import { useMemo } from "react";
import dayjs from "@/wrappers/dayjs";
import { blocksToSeconds } from "@/utils/blockchainUtils";
import { Card, CardBody } from "@nextui-org/react";

export default function ProposalBlockTimeDisplay({
  currentBlockNumber,
  blockString,
  label,
}: {
  currentBlockNumber: string | bigint;
  blockString: string;
  label: string;
}) {
  const date = useMemo(() => {
    const number = BigInt(currentBlockNumber);
    const at = BigInt(blockString);
    return dayjs()
      .add(blocksToSeconds(at - number), "second")
      .format("MMM D, YYYY [at] h:mm A z");
  }, [currentBlockNumber, blockString]);

  return (
    <Card>
      <CardBody>
        <div className="flex flex-col items-end gap-1 text-xs sm:items-center sm:text-sm">
          <div className="flex items-center gap-2">
            <p className="text-foreground-500">{label}</p>
            <p className="font-bold">{blockString}</p>
          </div>
          <div>
            <p className="text-2xs text-foreground-600 sm:text-xs">({date})</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
