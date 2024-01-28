"use client";

import useMaxSupply from "@/hooks/useMaxSupply";
import useTotalSupply from "@/hooks/useTotalSupply";
import { useEffect, useMemo, useState } from "react";
import { format as dnFormat } from "dnum";
import LabelWithPopover from "./components/LabelWithPopover";
import { governanceThresholdBps } from "@/utils/constants";

const governanceThresholdPercentage = governanceThresholdBps / 100;

const formatSupplyValue = (value: bigint | undefined): string =>
  value ? dnFormat([value, 18], 0) : "";

const calculateBpsOfMaxSupply = (
  totalSupply: bigint | undefined,
  maxSupply: bigint | undefined,
): number => {
  if (totalSupply === undefined || maxSupply === undefined || maxSupply === BigInt(0)) {
    return 0;
  }

  return Number((totalSupply * BigInt(10000)) / maxSupply);
};

export default function TokenSupplyProgressBar() {
  const { totalSupply } = useTotalSupply();
  const { maxSupply } = useMaxSupply();

  const percentageOfMaxSupply = useMemo(
    () => calculateBpsOfMaxSupply(totalSupply, maxSupply) / 100,
    [totalSupply, maxSupply],
  );

  const formattedTotalSupply = useMemo(() => formatSupplyValue(totalSupply), [totalSupply]);
  const formattedMaxSupply = useMemo(() => formatSupplyValue(maxSupply), [maxSupply]);

  return (
    <div className="mx-auto !max-w-screen-md px-2 md:container">
      <h1 className="py-6 text-2xl font-bold text-foreground">MUSHI Token Supply:</h1>
      <div className="px-2">
        <div className="relative"></div>
        <div className="relative z-0 h-4 overflow-hidden rounded-full bg-default-300/50">
          <div
            className="h-full rounded-full bg-primary transition-transform"
            style={{ transform: `translateX(-${100 - percentageOfMaxSupply}%)` }}
          ></div>
          <div
            className="z-2 absolute h-full w-1 bg-slate-100"
            style={{
              left: `${governanceThresholdPercentage}%`,
              top: 0,
              transform: "translateX(-50%)",
            }}
          ></div>
        </div>
        <div className="relative flex justify-end">
          <LabelWithPopover
            style={{
              position: "absolute",
              left: `${governanceThresholdPercentage}%`,
              top: '50%',
              transform: "translate(-50%, -50%)",
            }}
            placement="bottom"
            titleText="Governance Threshold"
            content={`Governance cannot begin until at least ${governanceThresholdPercentage}% of the max supply of tokens have been minted.`}
          />
          <LabelWithPopover
            label={formattedMaxSupply}
            placement="bottom"
            titleText="Max Supply"
            content={`The maximum token supply available for minting.`}
          />
        </div>
      </div>
    </div>
  );
}
