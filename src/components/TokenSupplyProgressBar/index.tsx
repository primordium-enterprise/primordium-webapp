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

  const governanceThresholdIsMet = useMemo(
    () =>
      totalSupply &&
      maxSupply &&
      totalSupply > (maxSupply * BigInt(governanceThresholdBps)) / BigInt(10000),
    [totalSupply, maxSupply],
  );

  return (
    <div className="mx-auto my-8 !max-w-screen-md px-2 md:container">
      <h1 className="pb-4 text-lg xs:text-xl sm:text-2xl font-500 text-foreground-600">MUSHI Token Supply:</h1>
      <div className="px-2 sm:px-6 md:px-8">
        <div className="relative mb-0.5 h-4 md:mb-1 md:h-5">
          <LabelWithPopover
            style={{
              // left: `${percentageOfMaxSupply}%`,
              right: 0,
              bottom: 0,
              // transform: "translateX(-50%)",
            }}
            label={formattedTotalSupply}
            placement="top"
            titleText="Total Supply"
            content="The total minted supply of MUSHI tokens in circulation."
          />
        </div>
        <div className="relative z-0 h-8 overflow-hidden rounded-full bg-default-300/50">
          <div
            className={`h-full ${governanceThresholdIsMet ? "bg-success" : "bg-primary"} rounded-full transition-transform !duration-700`}
            style={{ transform: `translateX(-${100 - percentageOfMaxSupply}%)` }}
          />
          <div
            className="z-2 absolute h-full w-1 bg-slate-100"
            style={{
              left: `${governanceThresholdPercentage}%`,
              top: 0,
              transform: "translateX(-50%)",
            }}
          />
        </div>
        <div className="relative mt-0.5 h-4 md:mt-1 md:h-5">
          <LabelWithPopover
            style={{
              left: `${governanceThresholdPercentage}%`,
              top: 0,
              transform: "translateX(-50%)",
            }}
            placement="bottom"
            titleText="Governance Threshold"
            content={`Governance cannot begin until at least ${governanceThresholdPercentage}% of the max supply of tokens have been minted.`}
          />
          <LabelWithPopover
            style={{
              right: 0,
            }}
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
