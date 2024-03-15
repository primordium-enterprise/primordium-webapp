"use client";

import { ButtonProps, Card, CardBody } from "@nextui-org/react";
import { ProposalVotes } from "../../types";
import { useMemo } from "react";

const VoteCount = ({
  label,
  display,
  color,
}: {
  label: string;
  display: string;
  color: ButtonProps["color"];
}) => {
  return (
    <div className="shrink-0 grow basis-0">
      <Card radius="sm">
        <CardBody className="text-md flex flex-row items-center justify-between gap-2 xs:flex-col sm:flex-row sm:text-lg">
          <div className={`text-center text-[0.8em] font-medium text-${color!}-300`}>{label}</div>
          <div className={`text-center font-bold text-${color!}-200`}>{display}</div>
        </CardBody>
      </Card>
    </div>
  );
};

export default function ProposalVoteCounts({
  votes,
  percentMajority,
}: {
  votes: ProposalVotes;
  percentMajority?: bigint;
}) {
  const percentMajorityDisplay = useMemo(
    () => percentMajority !== undefined && percentMajority.toString(),
    [percentMajority],
  );

  const showProgressBar = useMemo(
    () => votes.totalCounted > BigInt(0) && percentMajority !== undefined,
    [votes, percentMajority],
  );

  const percentFor = useMemo(
    () =>
      votes.for === BigInt(0) ? 66 : Number((votes.for * BigInt(10000)) / votes.totalCounted) / 100,
    [votes],
  );

  const isSuccessful = useMemo(() => {
    if (percentMajority === undefined) {
      return undefined;
    }

    if (votes.for === BigInt(0)) {
      return false;
    }

    const num = votes.for * BigInt(100);
    const div = num / votes.totalCounted;
    if (div > percentMajority) {
      return true;
    } else if (div === percentMajority) {
      let remainder = num % votes.totalCounted;
      if (remainder > BigInt(0)) {
        return true;
      }
    }
    return false;
  }, [votes, percentMajority]);

  return (
    <div data-section="proposal-vote-counts" className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col justify-center gap-2 xs:flex-row sm:gap-4">
        <VoteCount label="For:" display={votes.forDisplay} color="success" />
        <VoteCount label="Against:" display={votes.againstDisplay} color="danger" />
        <VoteCount label="Abstain:" display={votes.abstainDisplay} color="default" />
      </div>
      <div className="flex flex-col gap-2">
        <p className={`text-foreground-600 text-xs ${percentMajorityDisplay === false ? "invisible" : ""}`}>
          A {percentMajorityDisplay}% majority is required to succeed.
        </p>
        <div
          className={`relative h-6 w-full overflow-hidden rounded-full sm:h-8 ${isSuccessful === undefined || !showProgressBar ? "bg-foreground-100" : isSuccessful === true ? "bg-danger-50" : "bg-success-50"}`}
        >
          <div
            className="absolute left-0 top-0 h-full w-full translate-x-[-100%] rounded-full bg-success-400 transition-transform !duration-400"
            hidden={!showProgressBar}
            style={
              isSuccessful
                ? {
                    transform: `translateX(-${100 - percentFor}%)`,
                    zIndex: 20,
                  }
                : undefined
            }
          />
          <div
            className={`absolute left-0 top-0 z-10 h-full w-full translate-x-[100%] rounded-full bg-danger-400 transition-transform !duration-400`}
            hidden={!showProgressBar}
            style={
              isSuccessful === false
                ? {
                    transform: `translateX(${100 - percentFor}%)`,
                  }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
