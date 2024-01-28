"use client";

import useGovernanceCanBeginAt from "@/hooks/useGovernanceCanBeginAt";
import { useCallback, useEffect, useState } from "react";
import { useBlock } from "wagmi";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function GovernanceCountdown() {
  const { governanceCanBeginAt } = useGovernanceCanBeginAt();
  const { data, dataUpdatedAt } = useBlock({ watch: false, query: { refetchOnWindowFocus: false } });

  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | undefined>(undefined);

  const getTimeLeft = (): TimeLeft | undefined => {
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
    return undefined;
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

  return <div>{timeLeft && JSON.stringify(timeLeft)}</div>;
}
