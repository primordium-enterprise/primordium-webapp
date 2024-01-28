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
    return governanceCanBeginAt && data;
  }, [governanceCanBeginAt, data]);

  return (
    <div className="container mx-auto">
      <h2 className="text-center">Governance Can Begin In:</h2>
      <div className="flex justify-between">
        {Object.entries(timeLeft).map(([key, value]) => (
          <div key={key} className="flex flex-col items-center">
            <div>{value}</div>
            <div className="uppercase">{key}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
