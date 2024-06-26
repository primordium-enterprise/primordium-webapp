"use client";

import chainConfig from "@/config/chainConfig";
import useGovernanceCanBeginAt from "@/hooks/useGovernanceCanBeginAt";
import { GovernanceData } from "@/subgraph/subgraphQueries";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useBlock, useChainId } from "wagmi";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const defaultTimeLeft: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const padZero = (value: number, minDigits: number = 2) => {
  return value.toString().padStart(minDigits, "0");
};

export default function GovernanceCountdown({
  governanceData
}: {
  governanceData?: GovernanceData
}) {
  const governanceCanBeginAt = useMemo(() => {
    return governanceData?.governanceCanBeginAt;
  }, [governanceData]);

  const { data: block, dataUpdatedAt: blockUpdatedAt } = useBlock({
    watch: false,
    query: { refetchOnWindowFocus: false },
  });

  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(defaultTimeLeft);

  const getTimeLeft = (): TimeLeft => {
    if (governanceCanBeginAt && block) {
      let elapsedSeconds = Math.floor((Date.now() - blockUpdatedAt) / 1000);
      let differenceSeconds =
        Number(governanceCanBeginAt) - (Number(block.timestamp) + elapsedSeconds);
      if (differenceSeconds > 0) {
        return {
          days: Math.floor(differenceSeconds / (60 * 60 * 24)),
          hours: Math.max(0, Math.floor((differenceSeconds / (60 * 60)) % 24)),
          minutes: Math.max(0, Math.floor((differenceSeconds / 60) % 60)),
          seconds: Math.max(0, Math.floor(differenceSeconds % 60)),
        };
      }
    }
    return defaultTimeLeft;
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const timer = window.setTimeout(() => {
        setTimeLeft(getTimeLeft());
      }, 1000);
      return () => window.clearTimeout(timer);
    }
  });

  const isReady = useMemo(() => {
    setTimeLeft(getTimeLeft());
    return governanceCanBeginAt && block;
  }, [governanceCanBeginAt, block]);

  const isZero = useMemo(() => {
    return Object.values(timeLeft).every(v => v === 0);
  }, [timeLeft]);

  return (
    <div className="container mx-auto my-8">
      <h2 className="mb-0 text-center font-roboto-mono text-sm text-foreground-500 xs:mb-1 xs:text-base sm:mb-2 sm:text-lg">
        Governance Can Begin In
      </h2>
      <div
        className={`mx-auto flex max-w-[580px] justify-around ${!isReady ? "text-foreground-200" : ""} ${!isMounted ? "" : ""}`}
      >
        {Object.entries(timeLeft).map(([key, value]) => (
          <div key={key} className="flex grow basis-0 flex-col items-center">
            <div
              className={`font-roboto-mono text-4xl xs:text-5xl sm:text-6xl ${isReady && isZero ? "text-success-700" : ""}`}
            >
              {padZero(value)}
            </div>
            <div className="font-roboto-mono text-xs uppercase text-foreground-500 xs:text-sm sm:text-base">
              {key}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
