"use client";

import useGovernanceCanBeginAt from "@/hooks/useGovernanceCanBeginAt";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useBlock } from "wagmi";

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

export default function GovernanceCountdown() {
  const { governanceCanBeginAt } = useGovernanceCanBeginAt();
  const { data, dataUpdatedAt } = useBlock({
    watch: false,
    query: { refetchOnWindowFocus: false },
  });

  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(defaultTimeLeft);

  const getTimeLeft = (): TimeLeft => {
    if (governanceCanBeginAt && data) {
      let elapsedSeconds = Math.floor((Date.now() - dataUpdatedAt) / 1000);
      let differenceSeconds =
        Number(governanceCanBeginAt) - (Number(data.timestamp) + elapsedSeconds);
      return {
        days: Math.floor(differenceSeconds / (60 * 60 * 24)),
        hours: Math.max(0, Math.floor((differenceSeconds / (60 * 60)) % 24)),
        minutes: Math.max(0, Math.floor((differenceSeconds / 60) % 60)),
        seconds: Math.max(0, Math.floor(differenceSeconds % 60)),
      };
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
    return governanceCanBeginAt && data;
  }, [governanceCanBeginAt, data]);

  return (
    <div className="container mx-auto my-8">
      <h2 className="text-center text-base sm:text-lg mb-2 text-foreground-500">Governance Can Begin In</h2>
      <div
        className={`mx-auto flex max-w-[580px] justify-around ${!isReady ? "text-foreground-200" : ""} ${!isMounted ? "" : ""}`}
      >
        {Object.entries(timeLeft).map(([key, value]) => (
          <div key={key} className="flex flex-col items-center grow basis-0">
            <div className="text-4xl xs:text-5xl sm:text-6xl font-roboto-mono">{padZero(value)}</div>
            <div className="text-xs xs:text-sm sm:text-base uppercase text-foreground-500">{key}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
