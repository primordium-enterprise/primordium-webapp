"use client";

import { useEffect, useMemo, useState } from "react";
import { format as dnFormat } from "dnum";
import LabelWithPopover from "./components/LabelWithPopover";
import { UseQueryState } from "urql";
import { GovernanceData, MetaData } from "@/subgraph/subgraphQueries";

const formatSupplyValue = (value: bigint | undefined): string =>
  value !== undefined ? dnFormat([value, 18], 0) : "";

const calculateBpsOfMaxSupply = (
  totalSupply: bigint | undefined,
  maxSupply: bigint | undefined,
): number => {
  if (totalSupply === undefined || maxSupply === undefined || maxSupply === BigInt(0)) {
    return 0;
  }

  return Number((totalSupply * BigInt(10000)) / maxSupply);
};

export default function TokenSupplyProgressBar({
  governanceDataResult
}: {
  governanceDataResult: UseQueryState<{ governanceData: GovernanceData; _meta: MetaData; }>;
}) {
  const { data: { governanceData } = {}, fetching: isLoading, error } = governanceDataResult;
  const isError = useMemo(() => !!error, [error]);

  const { totalSupply, maxSupply, governanceThresholdBps } = useMemo(() => {
    if (!governanceData) {
      return {};
    }
    return {
      totalSupply: BigInt(governanceData.totalSupply),
      maxSupply: BigInt(governanceData.maxSupply),
      governanceThresholdBps: governanceData.governanceThresholdBps,
    }
  }, [governanceData]);

  const governanceThresholdPercentage = Number(governanceThresholdBps) / 100;

  const percentageOfMaxSupply = useMemo(
    () => calculateBpsOfMaxSupply(totalSupply, maxSupply) / 100,
    [totalSupply, maxSupply],
  );

  const formattedTotalSupply = useMemo(() => formatSupplyValue(totalSupply), [totalSupply]);
  const formattedMaxSupply = useMemo(() => formatSupplyValue(maxSupply), [maxSupply]);

  const governanceThresholdIsMet = useMemo(
    () => totalSupply && totalSupply > (maxSupply * BigInt(governanceThresholdBps)) / BigInt(10000),
    [totalSupply, maxSupply, governanceThresholdBps],
  );

  return (
    <div className="mx-auto my-8 !max-w-screen-md px-2 md:container" suppressHydrationWarning>
      <div className="px-2 sm:px-6 md:px-8">
        <div className="relative mb-0.5 h-4 md:mb-1 md:h-5">
          <LabelWithPopover
            style={{
              left: 0,
              bottom: 0,
            }}
            label={
              <span className="flex items-center">
                <span>MUSHI</span>
                <span className="text-xs text-foreground-500">&nbsp;{"(erc20)"}</span>
              </span>
            }
          />
          {!isLoading && (
            <LabelWithPopover
              style={{
                right: 0,
                bottom: 0,
              }}
              label={formattedTotalSupply}
              className={`${isError ? "text-danger-700" : ""}`}
              placement="top"
              titleText="Total Supply"
              contentItems={
                <span>
                  The total supply of MUSHI tokens in circulation.
                  {isError && (
                    <span className="text-danger-700">
                      {" "}
                      There was an error loading the current total supply.
                    </span>
                  )}
                </span>
              }
            />
          )}
        </div>
        <div className="relative z-0 h-4 overflow-hidden rounded-full bg-default-300/50 xs:h-6 sm:h-8">
          <div
            className={`h-full ${governanceThresholdIsMet ? "bg-success" : "bg-primary"} transition-transform !duration-700`}
            style={{ transform: `translateX(-${100 - percentageOfMaxSupply}%)` }}
          />
          {isLoading ? (
            <div className="z-2 absolute left-0 top-0 h-full w-full animate-indeterminate-bar rounded-full bg-default-300" />
          ) : (
            <div
              className="z-2 absolute h-full w-1 bg-slate-100"
              style={{
                left: `${governanceThresholdPercentage}%`,
                top: 0,
                transform: "translateX(-50%)",
              }}
            />
          )}
        </div>
        <div className="relative mt-0.5 h-4 md:mt-1 md:h-5">
          {!isLoading && (
            <LabelWithPopover
              style={{
                left: `${governanceThresholdPercentage}%`,
                top: 0,
                transform: "translateX(-50%)",
              }}
              placement="bottom"
              titleText="Governance Threshold"
              contentItems={`Governance cannot begin until at least ${governanceThresholdPercentage}% of the max supply of tokens have been minted.`}
            />
          )}

          <LabelWithPopover
            style={{
              right: 0,
            }}
            label={formattedMaxSupply}
            placement="bottom"
            titleText="Max Supply"
            contentItems={`The maximum token supply available for minting.`}
          />
        </div>
      </div>
    </div>
  );
}
